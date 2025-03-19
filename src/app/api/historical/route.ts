import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoria = searchParams.get("categoria") || "Novillos";
    const limit = parseInt(searchParams.get("limit") || "30");
    
    const data = await prisma.livestockPrice.findMany({
      where: {
        categoria: categoria,
      },
      orderBy: {
        fecha: 'desc',
      },
      take: limit,
    });
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching historical data:", error);
    return NextResponse.json(
      { error: "Failed to fetch historical data" },
      { status: 500 }
    );
  }
}