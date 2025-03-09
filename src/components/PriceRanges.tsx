import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, Star } from "lucide-react";  // Update import to include Star
import { Badge } from "@/components/ui/badge";  // Add this import at the top

interface PriceRangesProps {
  categoria: string;
  precio: number;
  precioMax: number | null;  // Add this
}

const PriceRanges: React.FC<PriceRangesProps> = ({ categoria, precio, precioMax }) => {
  const [isPrecioMaximo, setIsPrecioMaximo] = useState(false);
  
  // Constants for calculations
  const RINDE_FAENA = categoria === "Vacas" ? 0.54 : 0.58;
  const IVA_RATE = 0.105;
  const OTROS_IMPUESTOS = 0.15;

  // Base price calculation - use precioMax when isPrecioMaximo is true
  const precioBase = isPrecioMaximo && precioMax ? precioMax : precio;
  
  // Step 1: Apply IVA (10.5%)
  const precioConIVA = precioBase * (1 + IVA_RATE);
  
  // Step 2: Apply yield percentage (58% or 54%)
  const precioSegunRinde = precioConIVA / RINDE_FAENA;
  
  // Calculate individual components for display
  const ivaAmount = precioBase * IVA_RATE;
  const otrosImpuestosAmount = precioSegunRinde * OTROS_IMPUESTOS;
  const precioConImpuestos = precioBase + ivaAmount;
  const precioFinal = precioConImpuestos / RINDE_FAENA * (1 + OTROS_IMPUESTOS);
  
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border-t-4 border-t-blue-500">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex flex-col">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Calculator className="h-5 w-5 mr-2 text-blue-500" />
              Estimación de Precio Final Mayorista
            </div>
            {isPrecioMaximo && (
              <Badge variant="secondary" className="bg-blue-400 text-blue-100 px-4 py-1 text-xs flex items-center gap-1">
                Calidad Superior
                <Star className="h-3 w-3" />
              </Badge>
            )}
          </div>
          <span className="text-sm text-gray-400 mt-1 font-light">
            En base al {isPrecioMaximo ? 'máximo' : 'promedio'} en la categoria {categoria}
          </span>
        </CardTitle>
        <div className="flex gap-2 mt-2">
          <Button
            onClick={() => setIsPrecioMaximo(false)}
            variant={!isPrecioMaximo ? "default" : "outline"}
            size="sm"
          >
            Cal. Promedio
          </Button>
          <Button
            onClick={() => setIsPrecioMaximo(true)}
            variant={isPrecioMaximo ? "default" : "outline"}
            size="sm"
          >
            Cal. Superior (${precioMax?.toLocaleString('es-AR', { maximumFractionDigits: 2 }) ?? '-'})
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="text-sm">
              <p className="text-gray-600 dark:text-gray-400">Precio en Pie:</p>
              <p className="font-medium">${precioBase.toLocaleString('es-AR', { maximumFractionDigits: 2 })}/kg</p>
            </div>
            <div className="text-sm">
              <p className="text-gray-600 dark:text-gray-400">IVA (10.5%):</p>
              <p className="font-medium">+${ivaAmount.toLocaleString('es-AR', { maximumFractionDigits: 2 })}/kg</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="text-sm">
              <p className="text-gray-600 dark:text-gray-400">Precio con Impuestos:</p>
              <p className="font-medium">${precioConImpuestos.toLocaleString('es-AR', { maximumFractionDigits: 2 })}/kg</p>
            </div>
            <div className="text-sm">
              <p className="text-gray-600 dark:text-gray-400">Guías, distribución y márgenes comerciales:</p>
              <p className="font-medium">+${otrosImpuestosAmount.toLocaleString('es-AR', { maximumFractionDigits: 2 })}/kg</p>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t">
          <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4 border border-blue-100 dark:border-blue-900">
            <div className="text-center">
              <h1 className="text-blue-600 dark:text-blue-400 font-semibold">
                {categoria === "Novillitos" ? "NT" : 
                 categoria === "Novillos" ? "NO" :
                 categoria === "Vaquillonas" ? "VQ" :
                 categoria === "Vacas" ? "VA" :
                 categoria === "Toros" ? "TO" : ""} | {categoria}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-2 mb-1">Precio Final Estimado</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                ${precioFinal.toLocaleString('es-AR', { maximumFractionDigits: 2 })}
                <span className="text-lg font-normal text-blue-600 dark:text-blue-400">/kg</span>
              </p>
              <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900 px-3 py-1 rounded-full text-xs text-blue-700 dark:text-blue-300">
                <span>Rendimiento al gancho: {categoria === "Vacas" ? "54%" : "58%"}</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-6 text-center">
            *Todos los valores son estimativos y pueden variar según costos logísticos, distribución y márgenes comerciales.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceRanges;
  