"use client";

import { useState, useEffect } from "react";
import CategoryTabs from "@/components/CategoryTabs";
import PriceCard from "@/components/PriceCard";
import VolumeCard from "@/components/VolumeCard";
import DateCard from "@/components/DateCard";
import SummaryCard from "@/components/SummaryCard";
import PriceRanges from "@/components/PriceRanges";
import Footer from "@/components/Footer";
import SupportLocal from "@/components/SupportLocal";
// @ts-expect-error - react-world-flags lacks TypeScript definitions
import Flag from 'react-world-flags';

interface DataItem {
  categoria: string;
  precio: number;
  penultimoPrecio: number | null;
  variacionPorcentual: number | null;
  cabezas: number;
  fecha: string;
  penultimaFecha: string | null;
  penultimasCabezas: number | null;  // Add this line
}

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DataItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("Novillos");

  const fetchData = async (categoria: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/scrape?categoria=${categoria}`);
      if (!response.ok) {
        throw new Error("Error al obtener datos");
      }
      const result = await response.json();
      if (result.precio !== undefined) {
        setData([{ 
          categoria, 
          precio: result.precio, 
          penultimoPrecio: result.penultimoPrecio,
          variacionPorcentual: result.variacionPorcentual,
          cabezas: result.cabezas, 
          fecha: result.fecha,
          penultimaFecha: result.penultimaFecha,
          penultimasCabezas: result.penultimasCabezas
        }]);
      } else {
        setData(result);
      }
    } catch (err: unknown) {  // Changed from 'any' to 'unknown'
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(activeCategory);
  }, [activeCategory]);

  const lastCategoryData = Array.isArray(data)
    ? data.filter((item) => item.categoria === activeCategory).pop()
    : null;

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4 text-center flex items-center justify-center gap-3">
        <span>Carne Argentina</span>
        <Flag code="ar" className="max-h-3.5"/>
      </h1>
      <h2 className="mb-8 font-light text-center">
        Trazabilidad de precios, volumen y variaciónes del mercado de carne vacuna de Buenos Aires
      </h2>
      <CategoryTabs activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-500">Cargando datos...</p>
        </div>
      )}
      {error && (
        <div className="text-center py-8">
          <p className="text-red-500">Error: {error}</p>
        </div>
      )}
      {!loading && !error && lastCategoryData ? (
         <>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
           <PriceCard {...lastCategoryData} />
           <VolumeCard {...lastCategoryData} />
           <DateCard fecha={lastCategoryData.fecha} categoria={lastCategoryData.categoria} />
           <SummaryCard {...lastCategoryData} />
         </div>
         <div className="mt-6">
           <PriceRanges 
             categoria={lastCategoryData.categoria}
             precio={lastCategoryData.precio}
           />
         </div>
         <div className="mt-8">
           <SupportLocal />
         </div>
       </>
      ) : (
        !loading && !error && (
          <div className="text-center text-gray-500">No hay datos disponibles para esta categoría.</div>
        )
      )}
      <Footer />
    </div>
  );
}