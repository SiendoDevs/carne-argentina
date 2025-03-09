import React from 'react';
import Image from 'next/image';

interface WeekHeadsProps {
  weeklyVolume: number | null;
}

const WeekHeads: React.FC<WeekHeadsProps> = ({ weeklyVolume }) => {
  return (
    <div className="text-right">
      <div className="flex items-center justify-end gap-2">
        <Image
          src="/images/res-icon.svg"
          alt="Icono Res"
          width={32}
          height={32}
          className="opacity-90"
        />
        <div className="text-2xl md:text-2xl font-bold">
          {(weeklyVolume || 0).toLocaleString('es-AR')}
        </div>
      </div>
      <div className="text-sm md:text-base opacity-80">
        Cabezas Semana
      </div>
    </div>
  );
};

export default WeekHeads;