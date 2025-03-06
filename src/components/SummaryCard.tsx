// components/SummaryCard.tsx

import React from "react";
import { BarChart } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface SummaryCardProps {
  categoria: string;
  precio: number;
  cabezas: number;
  fecha: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  categoria,
  precio,
  cabezas,
  fecha,
}) => {
  const formatearFecha = (fechaStr: string) => {
    if (typeof fechaStr === "string" && fechaStr.includes("/")) {
      return fechaStr;
    } else {
      return "Fecha no disponible";
    }
  };

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border-t-4 border-t-blue-500">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <BarChart className="h-5 w-5 mr-2 text-blue-500" />
          Resumen
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center border-b pb-2">
            <span className="text-gray-600">Categoría:</span>
            <span className="font-medium">{categoria}</span>
          </div>
          <div className="flex justify-between items-center border-b pb-2">
            <span className="text-gray-600">Precio:</span>
            <span className="font-medium text-green-600">
              ${precio.toLocaleString("es-AR")}
            </span>
          </div>
          <div className="flex justify-between items-center border-b pb-2">
            <span className="text-gray-600">Cabezas:</span>
            <span className="font-medium">{cabezas.toLocaleString("es-AR")}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Fecha:</span>
            <span className="font-medium">{formatearFecha(fecha)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
