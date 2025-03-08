import React, { useEffect, useState } from 'react';
import Flag from "react-world-flags";
import Image from 'next/image';
import { memo } from 'react';
// import { MainNav } from "@/components/MainNav";
import { ThemeToggle } from "@/components/theme-toggle";
import WeekHeads from '@/components/WeekHeads';

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
    <div className="relative w-full h-[50vh] sm:h-[55vh] md:h-[60vh] mb-4 sm:mb-6 md:mb-8">
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
      <div className="container relative z-20 mx-auto px-4 py-4 sm:py-6 md:py-8">
        <div className="flex justify-end items-center">
          <div className="ml-4">
            <ThemeToggle />
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 text-white z-10">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center sm:items-end gap-4 sm:gap-0">
          <div className="text-center sm:text-left">
            <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-4xl font-bold mb-2 flex items-center justify-center sm:justify-start gap-2 sm:gap-3">
              <Flag code="ar" className="h-5 sm:h-6 md:h-8 mr-1" />
              <span>Carne Argentina</span>
            </h1>
            <h2 className="text-sm sm:text-md md:text-lg lg:text-lg font-light max-w-[280px] sm:max-w-sm lg:max-w-2xl">
              Sistema Informativo de Precios de la Carne Argentina
            </h2>
          </div>
          <div className="mt-2 sm:mt-0">
            <WeekHeads weeklyVolume={weeklyVolume} />
          </div>
        </div>
      </div>
    </div>
  );
});

Hero.displayName = 'Hero';

export default Hero;
