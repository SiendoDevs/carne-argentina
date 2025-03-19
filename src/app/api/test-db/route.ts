import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Test direct database write
    const testData = await prisma.livestockPrice.create({
      data: {
        categoria: "Test",
        precio: 1000,
        cabezas: 100,
        fecha: new Date().toISOString().split('T')[0],
      },
    });
    
    // Verify we can read it back
    const readBack = await prisma.livestockPrice.findUnique({
      where: {
        id: testData.id
      }
    });
    
    return NextResponse.json({
      success: true,
      message: "Test data successfully written and read",
      testData,
      readBack
    });
  } catch (error) {
    console.error("Database test error:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}