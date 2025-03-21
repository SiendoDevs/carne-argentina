"use client";

import React from 'react';
import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { LineChart, Line, XAxis, CartesianGrid, LabelList, ResponsiveContainer, YAxis, Tooltip } from 'recharts';

interface PriceChartProps {
  categoria: string;
  datosHistoricos: Array<{
    fecha: string;
    precio: number | null;
  }>;
}

const PriceChart: React.FC<PriceChartProps> = ({ categoria, datosHistoricos }) => {
  const datosValidos = datosHistoricos
    .filter(dato => dato.precio !== null)
    .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

  const variacionPorcentual = datosValidos.length >= 2 ?
    ((datosValidos[datosValidos.length - 1].precio! - datosValidos[datosValidos.length - 2].precio!) /
    datosValidos[datosValidos.length - 2].precio! * 100) : 0;

  const formatearFecha = (fecha: string) => {
    try {
      // Remove day name prefix if exists (e.g., "Vi 14/03/25" -> "14/03/25")
      const cleanFecha = fecha.replace(/^[A-Za-z]{2}\s+/, '');
      
      // Handle date format "YYYY-MM-DD" or "DD/MM/YY"
      const parts = cleanFecha.includes('/') ? cleanFecha.split('/') : cleanFecha.split('-');
      let date;
      
      if (cleanFecha.includes('/')) {
        // Format: DD/MM/YY
        const [day, month, year] = parts;
        date = new Date(2000 + parseInt(year), parseInt(month) - 1, parseInt(day));
      } else {
        // Format: YYYY-MM-DD
        const [year, month, day] = parts;
        date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      }

      if (isNaN(date.getTime())) {
        console.error('Invalid date:', fecha);
        return 'Fecha inválida';
      }

      return date.toLocaleDateString('es-AR', { 
        day: '2-digit', 
        month: '2-digit' 
      });
    } catch (error) {
      console.error('Error formatting date:', fecha, error);
      return 'Fecha inválida';
    }
  };

  const formatearPrecio = (precio: number) => {
    return `$${precio.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border-t-4 border-t-blue-500">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Evolución de Precios - {categoria}</CardTitle>
        <CardDescription>
          {datosValidos.length > 0 && (
            `${formatearFecha(datosValidos[0]?.fecha)} - ${formatearFecha(datosValidos[datosValidos.length - 1]?.fecha)}`
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={datosValidos}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="fecha"
                tickFormatter={formatearFecha}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                tickFormatter={(value) => `$${value}`}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(value: number) => [`${formatearPrecio(value)}`, 'Precio']}
                labelFormatter={formatearFecha}
              />
              <Line
                type="monotone"
                dataKey="precio"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ fill: "#2563eb", r: 4 }}
                activeDot={{ r: 6 }}
              >
                <LabelList
                  dataKey="precio"
                  position="top"
                  formatter={formatearPrecio}
                  style={{ fontSize: '12px' }}
                />
              </Line>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {variacionPorcentual > 0 ? (
            <>
              Subió un {variacionPorcentual.toFixed(1)}% este mes
              <TrendingUp className="h-4 w-4 text-green-500" />
            </>
          ) : variacionPorcentual < 0 ? (
            <>
              Bajó un {Math.abs(variacionPorcentual).toFixed(1)}% este mes
              <TrendingDown className="h-4 w-4 text-red-500" />
            </>
          ) : (
            "Sin cambios este mes"
          )}
        </div>
        <div className="leading-none text-muted-foreground">
          Mostrando precios históricos de los últimos {datosValidos.length} días
        </div>
      </CardFooter>
    </Card>
  );
};

export default PriceChart;