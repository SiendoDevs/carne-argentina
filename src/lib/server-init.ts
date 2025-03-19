import { startCronJob } from './cron';

export function initializeServer() {
  // Only start cron job in production and when server is running
  if (process.env.NODE_ENV === 'production') {
    console.log('Initializing server in production mode...');
    setTimeout(() => {
      startCronJob();
    }, 5000); // Wait 5 seconds for server to be fully started
  }
}