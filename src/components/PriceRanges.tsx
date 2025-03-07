import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";

interface PriceRangesProps {
  categoria: string;
  precio: number;
}

const PriceRanges: React.FC<PriceRangesProps> = ({ categoria, precio }) => {
  const [isPrecioMaximo, setIsPrecioMaximo] = useState(false);
  
  // Constants for calculations
  const RINDE_FAENA = 0.58;
  const IVA_RATE = 0.105;
  const OTROS_IMPUESTOS = 0.07
  const INCREMENTO_MAXIMO = 0.065; 

  // Base price calculation
  const precioBase = isPrecioMaximo ? precio * (1 + INCREMENTO_MAXIMO) : precio;
  const ivaAmount = precioBase * IVA_RATE;
  const otrosImpuestosAmount = precioBase * OTROS_IMPUESTOS;
  const precioConImpuestos = precioBase + ivaAmount + otrosImpuestosAmount;
  const precioFinal = precioConImpuestos / RINDE_FAENA;

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border-t-4 border-t-blue-500">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex flex-col">
          <div className="flex items-center">
            <Calculator className="h-5 w-5 mr-2 text-blue-500" />
            Estimación de Precio Final para Carnicerías
          </div>
          <span className="text-sm text-gray-600 mt-1 font-light">
            En base al {isPrecioMaximo ? 'máximo' : 'promedio'} en la categoria {categoria}
          </span>
        </CardTitle>
        <div className="flex gap-2 mt-2">
          <Button
            onClick={() => setIsPrecioMaximo(false)}
            variant={!isPrecioMaximo ? "default" : "outline"}
            size="sm"
          >
            Precio Promedio
          </Button>
          <Button
            onClick={() => setIsPrecioMaximo(true)}
            variant={isPrecioMaximo ? "default" : "outline"}
            size="sm"
          >
            Calidad Superior ($)
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="text-sm">
              <p className="text-gray-600">Precio en Pie:</p>
              <p className="font-medium">${precioBase.toLocaleString('es-AR', { maximumFractionDigits: 2 })}/kg</p>
            </div>
            <div className="text-sm">
              <p className="text-gray-600">IVA (10.5%):</p>
              <p className="font-medium">+${ivaAmount.toLocaleString('es-AR', { maximumFractionDigits: 2 })}/kg</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="text-sm">
              <p className="text-gray-600">Impuestos, distribución y margenes comerciales:</p>
              <p className="font-medium">+${otrosImpuestosAmount.toLocaleString('es-AR', { maximumFractionDigits: 2 })}/kg</p>
            </div>
            <div className="text-sm">
              <p className="text-gray-600">Precio con Impuestos:</p>
              <p className="font-medium">${precioConImpuestos.toLocaleString('es-AR', { maximumFractionDigits: 2 })}/kg</p>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-1">Precio Final Estimado</p>
              <p className="text-3xl font-bold text-blue-600 mb-2">
                ${precioFinal.toLocaleString('es-AR', { maximumFractionDigits: 2 })}
                <span className="text-lg font-normal text-blue-400">/kg</span>
              </p>
              <div className="inline-flex items-center gap-2 bg-blue-100 px-3 py-1 rounded-full text-sm text-blue-700">
                <span>Rendimiento al gancho: 58%</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3 text-center">
            *Todos los valores son estimativos y pueden variar según costos logísticos, distribución y márgenes comerciales.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceRanges;
  