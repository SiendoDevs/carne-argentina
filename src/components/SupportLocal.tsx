import React from 'react';
import { Card } from "@/components/ui/card";
import { Store } from "lucide-react";

const SupportLocal = () => {
  return (
    <Card className="bg-green-50 p-4 text-center mb-8">
      <div className="flex flex-col items-center justify-center gap-1 text-green-700">
        <div className="flex items-center gap-2 mt-3">
          <Store className="h-5 w-5" />
          <p className="font-semibold text-lg">
            ¡Apoyá el comercio local!
          </p>
        </div>
        <p className="text-sm text-green-700 mb-3">
          Comprá en carnicerías y frigoríficos de barrio
        </p>
      </div>
    </Card>
  );
};

export default SupportLocal;