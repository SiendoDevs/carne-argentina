import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
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

    // Aquí, puedes modificar esta parte para aceptar el parámetro dinámico
    const claseMap: { [key: string]: string } = {
      "Novillos": "1", // Novillos -> CLASE=1
      "Novillitos": "2", // Novillitos -> CLASE=2
      "Vaquillonas": "3", // Vaquillonas -> CLASE=3
      "Vacas": "5", // Vacas -> CLASE=5
    };

    // Obtener el parámetro 'categoria' desde la URL
    const url = new URL(request.url);
    const categoria = url.searchParams.get("categoria") || "Novillos"; // Por defecto 'Novillos'
    const clase = claseMap[categoria] || "1"; // CLASE=1 por defecto

    const apiUrl = `https://www.mercadoagroganadero.com.ar/php/hacigraf000110.chartjs.php?txtFECHAINI=${fechaInicioStr}&txtFECHAFIN=${fechaFinStr}&txtCLASE=${clase}`;

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

    return NextResponse.json({
      precio: ultimoPrecio,
      cabezas: ultimasCabezas,
      fecha: ultimaFecha,
      penultimoPrecio: penultimoPrecio,
      penultimasCabezas: penultimasCabezas,
      penultimaFecha: penultimaFecha,
      variacionPorcentual: variacionPorcentual,
      historico: datosHistoricos,
      periodoConsulta: {
        inicio: fechaInicioStr,
        fin: fechaFinStr
      }
    });  // Change from 'any' to 'unknown'
  } catch (error: unknown) {  // Change from 'any' to 'unknown'
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}