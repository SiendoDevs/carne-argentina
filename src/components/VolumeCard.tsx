import React from "react";
import { Users, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface VolumeCardProps {
  categoria: string; // We'll keep this in the interface but not use it in the component
  cabezas: number;
  penultimasCabezas: number | null;
  fecha: string;
  penultimaFecha: string | null;
}

const VolumeCard: React.FC<VolumeCardProps> = ({
  // Remove categoria from destructuring since it's not used
  cabezas,
  penultimasCabezas,
  penultimaFecha,
}) => {
  const formatearFecha = (fechaStr: string) => {
    if (typeof fechaStr === "string" && fechaStr.includes("/")) {
      return fechaStr;
    } else {
      return "Fecha no disponible";
    }
  };

  // Calcular variación porcentual de cabezas
  let variacionPorcentualCabezas: number | null = null;
  if (
    penultimasCabezas !== null &&
    penultimasCabezas !== undefined &&
    penultimasCabezas !== 0 &&
    cabezas !== null
  ) {
    variacionPorcentualCabezas =
      ((cabezas - penultimasCabezas) / penultimasCabezas) * 100;
  }

  // Determina si la variación es positiva, negativa o nula
  const esVariacionPositiva =
    variacionPorcentualCabezas !== null && variacionPorcentualCabezas > 0;
  const esVariacionNegativa =
    variacionPorcentualCabezas !== null && variacionPorcentualCabezas < 0;
  const hayVariacion = variacionPorcentualCabezas !== null;

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border-t-4 border-t-blue-600">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Users className="h-5 w-5 mr-2 text-blue-600" />
          Volumen Operado
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center pt-4">
        <p className="text-sm text-gray-500 mb-2">Cabezas</p>
        <div className="text-4xl font-bold mb-2 text-blue-600">
          {cabezas.toLocaleString("es-AR")}
        </div>

        {hayVariacion && (
          <div
            className={`flex items-center justify-center mb-2 ${
              esVariacionPositiva
                ? "text-green-600"
                : esVariacionNegativa
                ? "text-rose-500"
                : "text-gray-600"
            }`}
          >
            {esVariacionPositiva ? (
              <TrendingUp className="h-4 w-4 mr-1" />
            ) : esVariacionNegativa ? (
              <TrendingDown className="h-4 w-4 mr-1" />
            ) : (
              <span className="h-4 w-4 mr-1">-</span>
            )}
            <span className="font-medium">
              {Math.abs(variacionPorcentualCabezas!).toFixed(2)}%
              {esVariacionPositiva ? " ▲" : esVariacionNegativa ? " ▼" : ""}
            </span>
          </div>
        )}

        {penultimasCabezas !== null && penultimasCabezas !== undefined && (
          <p className="text-xs text-gray-500 mb-2">
            Anterior: {penultimasCabezas.toLocaleString("es-AR")} cabezas
            {penultimaFecha && ` (${formatearFecha(penultimaFecha)})`}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default VolumeCard;
