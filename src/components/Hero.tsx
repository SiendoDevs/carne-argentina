import React, { useEffect, useState } from 'react';
import Flag from "react-world-flags";
import Image from 'next/image';
import { memo } from 'react';
// import { MainNav } from "@/components/MainNav";
import { ThemeToggle } from "@/components/theme-toggle";

const Hero = memo(() => {
  const [weeklyVolume, setWeeklyVolume] = useState<number | null>(null);

  useEffect(() => {
    const fetchWeeklyVolume = async () => {
      try {
        const response = await fetch('/api/scrape?categoria=Novillos');
        const data = await response.json();
        setWeeklyVolume(data.weeklyVolume);
      } catch (error) {
        console.error('Error fetching weekly volume:', error);
      }
    };

    fetchWeeklyVolume();
  }, []);

  return (
    <div className="relative w-full h-[60vh] mb-8">
      <div className="absolute inset-0">
        <Image 
          src="/images/carne-argentina.jpg" 
          alt="Carne Argentina" 
          fill
          priority
          quality={100}
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      </div>
      <div className="container relative z-20 mx-auto px-4 py-8">
        <div className="flex justify-end items-center">
          <div className="ml-4">
            <ThemeToggle />
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-8 text-white z-10">
        <div className="container mx-auto px-4 flex justify-between items-end">
          <div>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2 flex items-center gap-3">
              <span>Carne Argentina</span>
              <Flag code="ar" className="h-6 md:h-8" />
            </h1>
            <h2 className="text-md md:text-xl lg:text-xl font-light max-w-sm lg:max-w-2xl">
              Trazabilidad de precios, volumen y variaciones del mercado de carne
              vacuna de Buenos Aires
            </h2>
          </div>
          {weeklyVolume && (
            <div className="text-right">
              <div className="text-2xl md:text-3xl font-bold">
                {weeklyVolume.toLocaleString('es-AR')}
              </div>
              <div className="text-sm md:text-base opacity-80">
                Cabezas Semana
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

Hero.displayName = 'Hero';

export default Hero;
