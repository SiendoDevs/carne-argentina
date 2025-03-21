import prisma from './prisma';

export interface LivestockData {
  categoria: string;
  precio: number;
  precioMax: number | null;
  precioMin: number | null;
  cabezas: number;
  fecha: string;
  variacionPorcentual: number | null;
  weeklyVolume: number | null;
  datosHistoricos?: Array<{
    fecha: string;
    precio: number | null;
  }>;
}

export async function storeDataIfNew(data: LivestockData): Promise<boolean> {
  try {
    console.log('Attempting to store data:', JSON.stringify(data, null, 2));
    
    // Format the date correctly from "Mi 19/03/25" to "2025-03-19"
    const dateMatch = data.fecha.match(/(\d{2})\/(\d{2})\/(\d{2})/);
    if (!dateMatch) {
      throw new Error(`Invalid date format: ${data.fecha}`);
    }
    const [, day, month, year] = dateMatch;
    const formattedDate = `20${year}-${month}-${day}`;
    
    // Get today's entries for this category
    const todayEntries = await prisma.livestockPrice.findMany({
      where: {
        categoria: data.categoria,
        fecha: formattedDate
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`Found ${todayEntries.length} entries for ${data.categoria} on ${formattedDate}`);

    // Always store the first entry of the day
    if (todayEntries.length === 0) {
      // Obtener datos históricos
      const historicalData = await prisma.livestockPrice.findMany({
        where: {
          categoria: data.categoria
        },
        orderBy: {
          fecha: 'desc'
        },
        take: 30,
        select: {
          fecha: true,
          precio: true
        }
      });

      const result = await prisma.livestockPrice.create({
        data: {
          categoria: data.categoria,
          precio: data.precio,
          precioMax: data.precioMax || undefined,
          precioMin: data.precioMin || undefined,
          cabezas: data.cabezas,
          fecha: formattedDate,
          datosHistoricos: historicalData,
          variacionPorcentual: data.variacionPorcentual || undefined,
          weeklyVolume: data.weeklyVolume || undefined,
          createdAt: new Date()
        }
      });
      console.log(`First entry of the day stored with ID: ${result.id}`);
      return true;
    }

    // Compare with the latest entry
    const latestEntry = todayEntries[0];
    const hasChanges = 
      latestEntry.precio !== data.precio ||
      latestEntry.cabezas !== data.cabezas ||
      latestEntry.precioMax !== data.precioMax ||
      latestEntry.precioMin !== data.precioMin;

    if (hasChanges) {
      // Obtener datos históricos
      const historicalData = await prisma.livestockPrice.findMany({
        where: {
          categoria: data.categoria
        },
        orderBy: {
          fecha: 'desc'
        },
        take: 30,
        select: {
          fecha: true,
          precio: true
        }
      });

      const result = await prisma.livestockPrice.create({
        data: {
          categoria: data.categoria,
          precio: data.precio,
          precioMax: data.precioMax || undefined,
          precioMin: data.precioMin || undefined,
          cabezas: data.cabezas,
          fecha: formattedDate,
          datosHistoricos: historicalData,
          variacionPorcentual: data.variacionPorcentual || undefined,
          weeklyVolume: data.weeklyVolume || undefined,
          createdAt: new Date()
        }
      });
      console.log(`New changes detected and stored with ID: ${result.id}`);
      return true;
    }

    console.log(`No changes detected for ${data.categoria}. Latest entry:`, latestEntry);
    return false;
  } catch (error) {
    console.error('Error storing livestock data:', error);
    throw error; // Throw the error to better track issues
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