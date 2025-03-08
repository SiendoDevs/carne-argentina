// components/DateCard.tsx

import React from "react";
import { Calendar } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { memo } from 'react';

interface DateCardProps {
  fecha: string;
  categoria: string;
}

const DateCard = memo(({ fecha, categoria }: DateCardProps) => {
  const formatearFecha = (fechaStr: string) => {
    if (typeof fechaStr === "string" && fechaStr.includes("/")) {
      return fechaStr;
    } else {
      return "Fecha no disponible";
    }
  };

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border-t-4 border-t-amber-500">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-amber-500" />
          Última Operación
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center pt-4">
        <p className="text-sm text-gray-500 mb-2">Fecha</p>
        <div className="text-4xl font-medium mb-2">
          {formatearFecha(fecha)}
        </div>
        <p className="text-xs text-gray-400">
          Categoría: {categoria}
        </p>
      </CardContent>
    </Card>
  );
});

DateCard.displayName = 'DateCard';

export default DateCard;
