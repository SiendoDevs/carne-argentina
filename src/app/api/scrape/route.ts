import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function GET(request: Request) {
  try {
    const mainResponse = await fetch("https://www.mercadoagroganadero.com.ar/dll/inicio.dll");
    const mainHtml = await mainResponse.text();
    const main$ = cheerio.load(mainHtml);
    
    // Get weekly volume with the correct selector
    const weeklyVolume = main$('.home-data').eq(2).text().trim();
    const parsedWeeklyVolume = weeklyVolume ? 
      parseInt(weeklyVolume.replace(/\D/g, '')) : 
      0;
    const { searchParams } = new URL(request.url);
    const categoria = searchParams.get("categoria");
  
    // Map category names to their respective class IDs
    const categoryMap: Record<string, string> = {
      Novillos: "1",
      Novillitos: "2",
      Vaquillonas: "3",
      Vacas: "5",
      Toros: "6",  // Added Toros with class ID 6
    };
    
    // Either use the classId variable or remove it
    // Option 1: Remove it if not needed
    // const classId = categoryMap[categoria || "Novillos"] || "1";
    
    // Option 2: Use it in the clase variable below
    const classId = categoryMap[categoria || "Novillos"] || "1";
    
    // Get ticker data first
    const tickerResponse = await fetch("https://www.mercadoagroganadero.com.ar/dll/inicio.dll", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      }
    });
    
    const html = await tickerResponse.text();
    const $ = cheerio.load(html);
    
    // Extract ticker data
    const tickerData: { [key: string]: { max: number; min: number } } = {};
    $('.ticker__list .ticker__item').each((_, element) => {
      const text = $(element).text().trim();
      
      if (!text || text.match(/^\s+$/)) return; // Skip empty items
      
      // Match pattern like "Novillos $ 1.700,00 / $ 3.100,00"
      const match = text.match(/^(\w+)\s+\$\s*([\d.,]+)\s*\/\s*\$\s*([\d.,]+)$/);
      
      if (match) {
        const categoria = match[1].trim();
        const precio1 = parseFloat(match[2].replace(/\./g, '').replace(',', '.'));
        const precio2 = parseFloat(match[3].replace(/\./g, '').replace(',', '.'));
        
        // Store both uppercase and original version
        tickerData[categoria] = {
          max: Math.max(precio1, precio2),
          min: Math.min(precio1, precio2)
        };
        tickerData[categoria.toUpperCase()] = {
          max: Math.max(precio1, precio2),
          min: Math.min(precio1, precio2)
        };
      }
    });

    // Remove the duplicate .marquee selector section as it's not needed

    // Log the extracted data for debugging
    console.log('Extracted ticker data:', tickerData);
    $('.ticker__viewport .marquee').each((_, element) => {
      const text = $(element).text().trim();
      // Adjust regex to match the format shown in the image
      const matches = text.matchAll(/(\w+)\s+\$\s*([\d.,]+)\s*\/\s*\$\s*([\d.,]+)/g);
      
      for (const match of matches) {
        const categoria = match[1].trim();
        const valores = [match[2], match[3]].map(v => 
          parseFloat(v.replace(/\./g, '').replace(',', '.'))
        ).sort((a, b) => b - a);
        
        tickerData[categoria] = {
          max: valores[0],
          min: valores[1]
        };
      }
    });

    // Calcular fechas para los últimos 7 días
    const fechaFin = new Date();
    const fechaInicio = new Date();
    fechaInicio.setDate(fechaInicio.getDate() - 7); // 7 días atrás

    // Formatear fechas al formato DD/MM/YYYY que espera la API
    const formatearFecha = (fecha: Date) => {
      const dia = fecha.getDate().toString().padStart(2, '0');
      const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
      const anio = fecha.getFullYear();
      return `${dia}/${mes}/${anio}`;
    };

    const fechaInicioStr = formatearFecha(fechaInicio);
    const fechaFinStr = formatearFecha(fechaFin);

    // Use classId directly instead of creating a new clase variable
    const apiUrl = `https://www.mercadoagroganadero.com.ar/php/hacigraf000110.chartjs.php?txtFECHAINI=${fechaInicioStr}&txtFECHAFIN=${fechaFinStr}&txtCLASE=${classId}`;
    console.log(`Consultando datos para ${categoria} desde ${fechaInicioStr} hasta ${fechaFinStr}`);
    const response = await fetch(apiUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
      },
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    const data = await response.json();
    const precios = data.data.find((d: { label: string; }) => d.label === "Precio Promedio")?.vals || [];
    const cabezas = data.data.find((d: { label: string; }) => d.label === "Cabezas")?.vals || [];
    const fechas = data.labels || [];
    if (precios.length === 0 || cabezas.length === 0 || fechas.length === 0) {
      throw new Error("No se encontraron precios, cabezas o fechas");
    }
    // Obtener el último registro disponible
    const ultimoPrecio = precios[precios.length - 1];
    const ultimasCabezas = cabezas[cabezas.length - 1];
    const ultimaFecha = fechas[fechas.length - 1];
    // Obtener el penúltimo registro disponible (si existe)
    const penultimoPrecio = precios.length > 1 ? precios[precios.length - 2] : null;
    const penultimasCabezas = cabezas.length > 1 ? cabezas[cabezas.length - 2] : null;
    const penultimaFecha = fechas.length > 1 ? fechas[fechas.length - 2] : null;
    // Calcular la variación porcentual si hay penúltimo precio
    let variacionPorcentual = null;
    if (penultimoPrecio !== null && ultimoPrecio !== null) {
      variacionPorcentual = ((ultimoPrecio - penultimoPrecio) / penultimoPrecio) * 100;
    }
    // Agregar datos históricos para posible uso en gráficos
    const datosHistoricos = fechas.map((fecha: string, index: number) => ({  // Changed from 'any' to specific types
      fecha: fecha,
      precio: precios[index] || null,
      cabezas: cabezas[index] || null,
    }));
    // Add ticker data to the response if available
    const tickerInfo = categoria ? (tickerData[categoria] || tickerData[categoria.toUpperCase()]) : null;
    
    return NextResponse.json({
      precio: ultimoPrecio,
      precioMax: tickerInfo?.max || null,
      precioMin: tickerInfo?.min || null,
      penultimoPrecio,
      variacionPorcentual,
      cabezas: ultimasCabezas,
      fecha: ultimaFecha,
      penultimaFecha,
      penultimasCabezas,
      datosHistoricos,
      weeklyVolume: parsedWeeklyVolume
    });

  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}