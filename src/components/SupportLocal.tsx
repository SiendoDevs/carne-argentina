import React from 'react';
import { Card } from "@/components/ui/card";
import { Store } from "lucide-react";
import { memo } from 'react';

const SupportLocal = memo(() => {
  return (
    <Card className="bg-gradient-to-br from-sky-50 to-indigo-50 dark:from-sky-950 dark:to-indigo-950 p-6 text-center mb-8 border border-sky-100 dark:border-sky-900">
      <div className="flex flex-col items-center justify-center gap-3 text-sky-700 dark:text-sky-400">
        <div className="flex items-center gap-2 mt-8">
          <Store className="h-6 w-6" />
          <p className="font-semibold text-2xl">
            ¡Apoyá el comercio local!
          </p>
        </div>
        <p className="text-md text-sky-600 dark:text-sky-400">
          Comprá en carnicerías y frigoríficos de barrio
        </p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-8">
          <div className="p-3 rounded-lg bg-white/50 dark:bg-sky-900/20">
            <p className="font-medium mb-1">Carne Fresca</p>
            <p className="text-sky-600/90 dark:text-sky-400/90">Atención personalizada y selección experta de cortes</p>
          </div>
          <div className="p-3 rounded-lg bg-white/50 dark:bg-sky-900/20">
            <p className="font-medium mb-1">Fortalecé tu Barrio</p>
            <p className="text-sky-600/90 dark:text-sky-400/90">Contribuí al desarrollo de la economía local</p>
          </div>
          <div className="p-3 rounded-lg bg-white/50 dark:bg-sky-900/20">
            <p className="font-medium mb-1">Mejor Servicio</p>
            <p className="text-sky-600/90 dark:text-sky-400/90">Asesoramiento profesional y cortes a medida</p>
          </div>
        </div>
      </div>
    </Card>
  );
});

SupportLocal.displayName = 'SupportLocal';

export default SupportLocal;