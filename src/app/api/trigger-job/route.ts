import { NextResponse } from "next/server";
import { manuallyTriggerJob } from "@/lib/cron";

export async function GET() {
  try {
    const result = await manuallyTriggerJob();
    
    return NextResponse.json({
      success: result,
      message: result ? "Job triggered successfully" : "Job failed to run",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error triggering job:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}