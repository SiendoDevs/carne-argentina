"use client";

import { useState, useEffect, useCallback } from "react";
import CategoryTabs from "@/components/CategoryTabs";
import PriceCard from "@/components/PriceCard";
import VolumeCard from "@/components/VolumeCard";
import DateCard from "@/components/DateCard";
import SummaryCard from "@/components/SummaryCard";
import PriceRanges from "@/components/PriceRanges";
import Footer from "@/components/Footer";
import SupportLocal from "@/components/SupportLocal";
import  Hero  from "@/components/Hero";
import AlertModal from "@/components/AlertModal";
import LoadingSkeleton from "@/components/LoadingSkeleton";

interface DataItem {
  categoria: string;
  precio: number;
  precioMax: number | null;  // Add this
  precioMin: number | null;  // Add this
  penultimoPrecio: number | null;
  variacionPorcentual: number | null;
  cabezas: number;
  fecha: string;
  penultimaFecha: string | null;
  penultimasCabezas: number | null;
}

// Add cache interface
interface CacheData {
  data: DataItem[];
  timestamp: number;
}

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DataItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("Novillos");
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const CACHE_DURATION = 1000 * 60 * 30; // 30 minutes cache

  const getCachedData = (categoria: string) => {
    try {
      const cached = localStorage.getItem(`livestock_data_${categoria}`);
      if (cached) {
        const parsedCache: CacheData = JSON.parse(cached);
        const isExpired = Date.now() - parsedCache.timestamp > CACHE_DURATION;
        
        if (!isExpired) {
          return parsedCache.data;
        }
      }
    } catch (error) {
      console.error('Cache reading error:', error);
    }
    return null;
  };

  const setCachedData = (categoria: string, data: DataItem[]) => {
    try {
      const cacheData: CacheData = {
        data,
        timestamp: Date.now(),
      };
      localStorage.setItem(`livestock_data_${categoria}`, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Cache writing error:', error);
    }
  };

  // Fix the fetchData function to prevent infinite loops
  const fetchData = useCallback(async (categoria: string) => {
    // Try to get cached data first
    const cachedData = getCachedData(categoria);
    if (cachedData) {
      setData(cachedData);
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/scrape?categoria=${categoria}`);
      if (!response.ok) {
        throw new Error("Error al obtener datos");
      }
      const result = await response.json();
      if (result.precio !== undefined) {
        const newData = [{
          categoria,
          precio: result.precio,
          precioMax: result.precioMax || result.precio * 1.15,
          precioMin: result.precioMin,
          penultimoPrecio: result.penultimoPrecio,
          variacionPorcentual: result.variacionPorcentual,
          cabezas: result.cabezas,
          fecha: result.fecha,
          penultimaFecha: result.penultimaFecha,
          penultimasCabezas: result.penultimasCabezas,
        }];
        setData(newData);
        setCachedData(categoria, newData);
      } else {
        setData(result);
        setCachedData(categoria, result);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
      setIsAlertOpen(true);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array to prevent recreation on each render

  useEffect(() => {
    fetchData(activeCategory);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory]); // Only depend on activeCategory, not fetchData

  const lastCategoryData = Array.isArray(data)
    ? data.filter((item) => item.categoria === activeCategory).pop()
    : null;

  return (
    <>
      <AlertModal 
        isOpen={isAlertOpen} 
        onClose={() => setIsAlertOpen(false)} 
      />

      <Hero />
      <div className="container mx-auto px-4 pb-8">
        <CategoryTabs
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />
        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">Error: {error}</p>
          </div>
        ) : lastCategoryData ? (
          <>
            <div className="mt-2 mb-8">
              <PriceRanges
                categoria={lastCategoryData.categoria}
                precio={lastCategoryData.precio}
                precioMax={lastCategoryData.precioMax}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <PriceCard {...lastCategoryData} />
              <VolumeCard {...lastCategoryData} />
              <DateCard
                fecha={lastCategoryData.fecha}
                categoria={lastCategoryData.categoria}
              />
              <SummaryCard
                categoria={lastCategoryData.categoria}
                precioMax={lastCategoryData.precioMax}
                precioMin={lastCategoryData.precioMin}
              />
            </div>
            <div className="mt-8">
              <SupportLocal />
            </div>
          </>
        ) : (
          !loading &&
          !error && (
            <div className="text-center text-gray-500">
              No hay datos disponibles para esta categoría.
            </div>
          )
        )}
        <Footer />
      </div>
    </>
  );
}
