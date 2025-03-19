import type { NextConfig } from "next";
import { startCronJob } from "./src/lib/cron";

// Only start the cron job in production when server is running
if (process.env.NODE_ENV === 'production') {
  // Wait for server to be fully started
  if (typeof window === 'undefined') {  // Only run on server-side
    setTimeout(() => {
      console.log('Starting cron job in production mode...');
      startCronJob();
    }, 5000);  // Wait 5 seconds after server start
  }
}

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
