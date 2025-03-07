import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calculator } from "lucide-react";

interface PriceRangesProps {
  categoria: string;
  precio: number;
}

const PriceRanges: React.FC<PriceRangesProps> = ({ categoria, precio }) => {
  // Constants for calculations
  const RINDE_FAENA = 0.58; // 58% yield after slaughter
  const IVA_RATE = 0.105; // 10.5% IVA
  const OTROS_IMPUESTOS = 0.06; // 6% other taxes

  // Calculations
  const ivaAmount = precio * IVA_RATE;
  const otrosImpuestosAmount = precio * OTROS_IMPUESTOS;
  const precioConImpuestos = precio + ivaAmount + otrosImpuestosAmount;
  const precioFinal = precioConImpuestos / RINDE_FAENA;

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border-t-4 border-t-blue-500">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex flex-col">
          <div className="flex items-center">
            <Calculator className="h-5 w-5 mr-2 text-blue-500" />
            Estimación de Precio Final
          </div>
          <span className="text-sm text-gray-600 mt-1 font-light">
            En base al promedio de {categoria}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="text-sm">
              <p className="text-gray-600">Precio en Pie:</p>
              <p className="font-medium">${precio.toLocaleString('es-AR')}/kg</p>
            </div>
            <div className="text-sm">
              <p className="text-gray-600">IVA (10.5%):</p>
              <p className="font-medium">+${ivaAmount.toLocaleString('es-AR', { maximumFractionDigits: 2 })}/kg</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="text-sm">
              <p className="text-gray-600">Otros Impuestos (6%):</p>
              <p className="font-medium">+${otrosImpuestosAmount.toLocaleString('es-AR', { maximumFractionDigits: 2 })}/kg</p>
            </div>
            <div className="text-sm">
              <p className="text-gray-600">Precio con Impuestos:</p>
              <p className="font-medium">${precioConImpuestos.toLocaleString('es-AR', { maximumFractionDigits: 2 })}/kg</p>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t">
          <p className="text-lg font-semibold text-blue-600">
            Precio Final Estimado: ${precioFinal.toLocaleString('es-AR', { maximumFractionDigits: 2 })}/kg
          </p>
          <div className="mt-2 text-sm text-gray-600">
            <p>Rendimiento aproximado en gancho: 58%</p>
            <p>1kg en pie ≈ {(1/RINDE_FAENA).toFixed(2)}kg de carne</p>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            *Estos valores son estimativos y pueden variar según costos logísticos, distribución y márgenes comerciales.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceRanges;
  