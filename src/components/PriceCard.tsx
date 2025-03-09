import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface PriceCardProps {
  categoria: string;
  precio: number;
  penultimoPrecio: number | null;
  variacionPorcentual: number | null;
  fecha: string;
  penultimaFecha: string | null;
}

const PriceCard: React.FC<PriceCardProps> = ({
  categoria,
  precio,
  penultimoPrecio,
  variacionPorcentual,
  penultimaFecha,
}) => {  // Remove 'fecha' from props destructuring since it's not used
  // Get category-specific styling
  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "Novillos":
        return "border-t-blue-500";
      case "Novillitos":
        return "border-t-green-500";
      case "Vacas":
        return "border-t-purple-500";
      case "Vaquillonas":
        return "border-t-pink-500";
      case "Toros":
        return "border-t-amber-500";
      default:
        return "border-t-gray-500";
    }
  };
  const formatearFecha = (fechaStr: string) => {
    if (typeof fechaStr === "string" && fechaStr.includes("/")) {
      return fechaStr;
    } else {
      return "Fecha no disponible";
    }
  };

  // Determina si la variación es positiva, negativa o nula
  const esVariacionPositiva = variacionPorcentual !== null && variacionPorcentual > 0;
  const esVariacionNegativa = variacionPorcentual !== null && variacionPorcentual < 0;
  const hayVariacion = variacionPorcentual !== null;

  return (
    <Card className={`shadow-md hover:shadow-lg transition-shadow duration-300 border-t-4 ${getCategoryColor(categoria)}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-emerald-500" />
          Precio {categoria} (en pie)
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center pt-4">
        <p className="text-sm text-gray-500 mb-2">Precio Promedio</p>
        <div className="text-4xl font-bold mb-2 text-emerald-600">
          ${precio.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          <span className="text-lg font-normal text-emerald-600">/kg</span>
        </div>
        
        {hayVariacion && (
          <div className={`flex items-center justify-center mb-2 ${
            esVariacionPositiva ? 'text-green-600' : esVariacionNegativa ? 'text-rose-500' : 'text-gray-600'
          }`}>
            {esVariacionPositiva ? (
              <TrendingUp className="h-4 w-4 mr-1" />
            ) : esVariacionNegativa ? (
              <TrendingDown className="h-4 w-4 mr-1" />
            ) : null}
            <span className="font-medium">
              {variacionPorcentual.toFixed(2)}%
            </span>
          </div>
        )}
        
        {penultimoPrecio !== null && (
          <p className="text-xs text-gray-500 mb-2">
            Precio anterior: ${penultimoPrecio.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/kg
            {penultimaFecha && ` (${formatearFecha(penultimaFecha)})`}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default PriceCard;