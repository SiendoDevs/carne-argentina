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
    console.log('New scraped data:', JSON.stringify(data, null, 2));
    
    // Get the most recent entry for this category from today
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    const latestEntry = await prisma.livestockPrice.findFirst({
      where: {
        categoria: data.categoria,
        fecha: today
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Log the comparison
    if (latestEntry) {
      console.log('Latest stored data:', JSON.stringify(latestEntry, null, 2));
      console.log('Comparing prices:', {
        storedPrice: latestEntry.precio,
        newPrice: data.precio,
        storedVolume: latestEntry.cabezas,
        newVolume: data.cabezas
      });
    }

    // If no entry exists for today or if the price/volume has changed, store the new data
    if (!latestEntry || 
        latestEntry.precio !== data.precio || 
        latestEntry.cabezas !== data.cabezas ||
        latestEntry.precioMax !== data.precioMax ||
        latestEntry.precioMin !== data.precioMin) {
      
      const result = await prisma.livestockPrice.create({
        data: {
          ...data,
          createdAt: new Date()
        }
      });

      console.log(`Stored new data with ID: ${result.id} - Price changed or new entry for today`);
      return true;
    }

    console.log(`No changes detected for ${data.categoria} today. Skipping storage.`);
    return false;
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