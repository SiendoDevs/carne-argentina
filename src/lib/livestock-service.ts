import prisma from './prisma';
// Remove the unused cheerio import
// import * as cheerio from 'cheerio';

export interface LivestockData {
  categoria: string;
  precio: number;
  precioMax: number | null;
  precioMin: number | null;
  cabezas: number;
  fecha: string;
  variacionPorcentual: number | null;
  weeklyVolume: number | null;
}

export async function storeDataIfNew(data: LivestockData): Promise<boolean> {
  try {
    console.log('Attempting to store data:', JSON.stringify(data, null, 2));
    
    // Check if the market should be operating (Monday to Friday, 8:00 to 20:00 Argentina time)
    const now = new Date();
    const argTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Argentina/Buenos_Aires' }));
    const isWeekday = argTime.getDay() > 0 && argTime.getDay() < 6;
    const isOperatingHours = argTime.getHours() >= 8 && argTime.getHours() < 20;

    if (!isWeekday || !isOperatingHours) {
      console.log('Market is closed. Skipping data storage.');
      return false;
    }

    // Get the most recent entry for this category
    const latestEntry = await prisma.livestockPrice.findFirst({
      where: {
        categoria: data.categoria,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // If we have a previous entry, check if the price has actually changed
    if (latestEntry) {
      const priceChanged = latestEntry.precio !== data.precio;
      const volumeChanged = latestEntry.cabezas !== data.cabezas;
      
      if (!priceChanged && !volumeChanged) {
        console.log(`No changes detected for ${data.categoria}. Skipping storage.`);
        return false;
      }
    }

    // Store new data with timestamp
    const result = await prisma.livestockPrice.create({
      data: {
        ...data,
        createdAt: new Date(),
      },
    });

    console.log(`Successfully stored new data with ID: ${result.id}`);
    return true;
  } catch (error) {
    console.error('Error storing livestock data:', error);
    return false;
  }
}

export async function fetchAndStoreAllCategories(): Promise<void> {
  const categories = ['Novillos', 'Novillitos', 'Vaquillonas', 'Vacas', 'Toros'];
  
  // Get the base URL from environment or use localhost in development
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  for (const categoria of categories) {
    try {
      // Use the complete URL
      const response = await fetch(`${baseUrl}/api/scrape?categoria=${categoria}`);
      
      if (!response.ok) {
        console.error(`Failed to fetch data for ${categoria}: ${response.status}`);
        continue;
      }
      
      const data = await response.json();
      
      if (data.precio) {
        await storeDataIfNew({
          categoria,
          precio: data.precio,
          precioMax: data.precioMax,
          precioMin: data.precioMin,
          cabezas: data.cabezas,
          fecha: data.fecha,
          variacionPorcentual: data.variacionPorcentual,
          weeklyVolume: data.weeklyVolume,
        });
      }
    } catch (error) {
      console.error(`Error processing ${categoria}:`, error);
    }
  }
}