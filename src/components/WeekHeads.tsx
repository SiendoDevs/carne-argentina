import React from 'react';
import Image from 'next/image';

interface WeekHeadsProps {
  weeklyVolume: number | null;
}

const WeekHeads: React.FC<WeekHeadsProps> = ({ weeklyVolume }) => {
  return (
    <div className="text-right">
      {weeklyVolume ? (
        <>
          <div className="flex items-center justify-end gap-2">
            <Image
              src="/images/res-icon.svg"
              alt="Icono Res"
              width={32}
              height={32}
              className="opacity-90"
            />
            <div className="text-2xl md:text-3xl font-bold">
              {weeklyVolume.toLocaleString('es-AR')}
            </div>
          </div>
          <div className="text-sm md:text-base opacity-80">
            Cabezas  Semana
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center justify-end gap-2">
            <div className="w-8 h-8 bg-white/20 animate-pulse rounded" />
            <div className="w-32 h-8 bg-white/20 animate-pulse rounded" />
          </div>
          <div className="w-24 h-5 bg-white/20 animate-pulse rounded mt-1 ml-auto" />
        </>
      )}
    </div>
  );
};

export default WeekHeads;