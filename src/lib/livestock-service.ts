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
    
    // Check if we already have this data
    const existing = await prisma.livestockPrice.findFirst({
      where: {
        categoria: data.categoria,
        fecha: data.fecha,
      },
    });

    // If data already exists, don't store it again
    if (existing) {
      console.log(`Data for ${data.categoria} on ${data.fecha} already exists`);
      return false;
    }

    // Store new data
    const result = await prisma.livestockPrice.create({
      data: {
        categoria: data.categoria,
        precio: data.precio,
        precioMax: data.precioMax || undefined,
        precioMin: data.precioMin || undefined,
        cabezas: data.cabezas,
        fecha: data.fecha,
        variacionPorcentual: data.variacionPorcentual || undefined,
        weeklyVolume: data.weeklyVolume || undefined,
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