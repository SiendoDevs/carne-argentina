import type { NextConfig } from "next";
import { startCronJob } from "./src/lib/cron";

// Start the cron job when the server starts - in both dev and production
// This ensures we can test it in development mode
setTimeout(() => {
  console.log('Starting cron job...');
  startCronJob();
}, 3000); // Small delay to ensure server is fully initialized

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
