import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Count total entries
    const count = await prisma.livestockPrice.count();
    
    // Get latest 5 entries
    const latestEntries = await prisma.livestockPrice.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json({
      success: true,
      totalEntries: count,
      latestEntries
    });
  } catch (error) {
    console.error("Error checking database:", error);
    return NextResponse.json(
      { success: false, error: "Failed to check database" },
      { status: 500 }
    );
  }
}