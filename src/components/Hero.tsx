import React from 'react';
import Flag from "react-world-flags";
import Image from 'next/image';

const Hero = () => {
  return (
    <div className="relative w-screen h-[60vh] -mx-4 -mt-8 mb-8">
      <div className="relative h-full w-full overflow-hidden">
        <Image 
          src="/images/carne-argentina.jpg" 
          alt="Carne Argentina" 
          fill
          priority
          quality={100}
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
        <div className="container mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
            <span>Carne Argentina</span>
            <Flag code="ar" className="max-h-6" />
          </h1>
          <h2 className="text-lg md:text-xl font-light max-w-3xl">
            Trazabilidad de precios, volumen y variaciones del mercado de carne
            vacuna de Buenos Aires
          </h2>
        </div>
      </div>
    </div>
  );
};

export default Hero;