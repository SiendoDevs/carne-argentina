import React from 'react';
import { Card } from "@/components/ui/card";
import { Store } from "lucide-react";
import { memo } from 'react';

const SupportLocal = memo(() => {
  return (
    <Card className="bg-green-50 dark:bg-green-950 p-4 text-center mb-8">
      <div className="flex flex-col items-center justify-center gap-1 text-green-700 dark:text-green-400">
        <div className="flex items-center gap-2 mt-3">
          <Store className="h-5 w-5" />
          <p className="font-semibold text-lg">
            ¡Apoyá el comercio local!
          </p>
        </div>
        <p className="text-sm text-green-700 dark:text-green-400 mb-3">
          Comprá en carnicerías y frigoríficos de barrio
        </p>
      </div>
    </Card>
  );
});

SupportLocal.displayName = 'SupportLocal';

export default SupportLocal;