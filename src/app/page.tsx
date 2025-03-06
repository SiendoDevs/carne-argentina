"use client";

import { useState, useEffect } from "react";
import CategoryTabs from "@/components/CategoryTabs";
import PriceCard from "@/components/PriceCard";
import VolumeCard from "@/components/VolumeCard";
import DateCard from "@/components/DateCard";
import SummaryCard from "@/components/SummaryCard";
import PriceRanges from "@/components/PriceRanges";

interface DataItem {
  categoria: string;
  precio: number;
  penultimoPrecio: number | null;
  variacionPorcentual: number | null;
  cabezas: number;
  fecha: string;
  penultimaFecha: string | null;
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
          penultimaFecha: result.penultimaFecha
        }]);
      } else {
        setData(result);
      }
    } catch (err: any) {
      setError(err.message);
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
      <h1 className="text-2xl font-bold mb-8 text-center">Trazabilidad de Precios de la Carne Argentina</h1>
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
           <PriceRanges />
         </div>
       </>
      ) : (
        !loading && !error && (
          <div className="text-center text-gray-500">No hay datos disponibles para esta categoría.</div>
        )
      )}
    </div>
  );
}