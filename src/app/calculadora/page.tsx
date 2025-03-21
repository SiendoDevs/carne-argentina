"use client";

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface VentaItem {
  corte: string;
  kgs: number;
  precioKg: number;
  total: number;
}

export default function CalculadoraPage() {
  const [pesoMediaRes, setPesoMediaRes] = useState<number>(100);
  const [precioKgCompra, setPrecioKgCompra] = useState<number>(6150);
  const [pesoCMerma, setPesoCMerma] = useState<number>(0);
  const [ventas, setVentas] = useState<VentaItem[]>([
    { corte: 'Mocho', kgs: 32, precioKg: 7500, total: 0 },
    { corte: 'Parrillero', kgs: 32, precioKg: 8200, total: 0 },
    { corte: 'Pecho', kgs: 32, precioKg: 4800, total: 0 },
  ]);

  // Calcular el precio por kg después de la merma
  const precioPorKgDespuesMerma = (pesoMediaRes * precioKgCompra) / pesoCMerma;

  useEffect(() => {
    // Calcular merma (4% por defecto)
    const merma = pesoMediaRes * 0.04;
    setPesoCMerma(pesoMediaRes - merma);
  }, [pesoMediaRes]); // Only recalculate when pesoMediaRes changes

  const totalCompra = pesoMediaRes * precioKgCompra;
  const promedioVenta = ventas.reduce((acc, curr) => acc + curr.precioKg, 0) / ventas.length;
  const totalVenta = ventas.reduce((acc, curr) => acc + curr.total, 0);
  const diferencia = totalVenta - totalCompra;

  const handleVentaChange = (index: number, field: keyof VentaItem, value: number) => {
    setVentas(prevVentas => {
      const nuevasVentas = [...prevVentas];
      const venta = nuevasVentas[index];
      nuevasVentas[index] = {
        ...venta,
        [field]: value,
        total: field === 'kgs' ? value * venta.precioKg :
               field === 'precioKg' ? venta.kgs * value :
               venta.total
      };
      return nuevasVentas;
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center mb-8">Calculadora de Promedios</h1>
      
      <div className="grid gap-8 grid-cols-1 lg:grid-cols-3 max-w-4xl mx-auto">
        {/* Sección de Compra */}
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border-t-4 border-t-orange-400 w-full">
          <CardHeader>
            <CardTitle className="text-xl">Compra</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="pesoMediaRes">Peso Media Res (kg)</Label>
                <Input
                  id="pesoMediaRes"
                  type="number"
                  value={pesoMediaRes}
                  onChange={(e) => setPesoMediaRes(Number(e.target.value))}
                  className="max-w-[200px]"
                />
              </div>
              <div>
                <Label htmlFor="precioKgCompra">Precio por kg ($)</Label>
                <Input
                  id="precioKgCompra"
                  type="number"
                  value={precioKgCompra}
                  onChange={(e) => setPrecioKgCompra(Number(e.target.value))}
                  className="max-w-[200px]"
                />
              </div>
              <div>
                <Label>Peso c/merma (kg)</Label>
                <div className="text-lg font-semibold text-gray-700">
                  {pesoCMerma.toFixed(2)}
                </div>
                <div className="mt-2">
                  <Label>Precio por kg c/merma ($)</Label>
                  <div className="text-lg font-semibold text-gray-700">
                    {precioPorKgDespuesMerma.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
              <div>
                <Label>Total Compra ($)</Label>
                <div className="text-xl font-bold text-orange-600">
                  ${totalCompra.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sección de Venta */}
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border-t-4 border-t-green-400 lg:col-span-2 w-full">
          <CardHeader>
            <CardTitle className="text-xl">Venta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {ventas.map((venta, index) => (
              <div key={venta.corte} className="grid gap-2">
                <div className="font-semibold text-gray-700">{venta.corte}</div>
                <div className="grid grid-cols-2">
                  <div>
                    <Label htmlFor={`kgs-${index}`}>Kgs</Label>
                    <Input
                      id={`kgs-${index}`}
                      type="number"
                      value={venta.kgs}
                      onChange={(e) => handleVentaChange(index, 'kgs', Number(e.target.value))}
                      className="max-w-[150px]"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`precio-${index}`}>Precio x kg ($)</Label>
                    <Input
                      id={`precio-${index}`}
                      type="number"
                      value={venta.precioKg}
                      onChange={(e) => handleVentaChange(index, 'precioKg', Number(e.target.value))}
                      className="max-w-[150px]"
                    />
                  </div>
                </div>
                <div>
                  <Label>Total ($)</Label>
                  <div className="text-lg font-semibold text-gray-700">
                    ${venta.total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
            ))}
            <div className="pt-4 border-t">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Promedio</Label>
                  <div className="text-xl font-bold text-blue-600">
                    ${promedioVenta.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                  </div>
                </div>
                <div>
                  <Label>Total Venta</Label>
                  <div className="text-xl font-bold text-green-600">
                    ${totalVenta.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                  </div>
                </div>
                <div>
                  <Label>Diferencia</Label>
                  <div className={`text-xl font-bold ${diferencia >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${diferencia.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}