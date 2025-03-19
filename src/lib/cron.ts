import cron from 'node-cron';
import { fetchAndStoreAllCategories } from './livestock-service';

let cronJob: cron.ScheduledTask | null = null;

export function startCronJob() {
  if (cronJob) {
    return;
  }
  
  // Run the job immediately when starting
  console.log('Running initial data fetch:', new Date().toISOString());
  fetchAndStoreAllCategories().catch(error => {
    console.error('Error in initial data fetch:', error);
  });
  
  // Then run every 10 seconds - using a more explicit configuration
  cronJob = cron.schedule('*/10 * * * * *', async () => {
    console.log('Running scheduled data fetch:', new Date().toISOString());
    try {
      await fetchAndStoreAllCategories();
    } catch (error) {
      console.error('Error in scheduled job:', error);
    }
  }, {
    scheduled: true,
    timezone: "UTC"
  });
  
  // Explicitly start the job
  cronJob.start();
  
  console.log('Scheduled job started');
}

export function stopCronJob() {
  if (cronJob) {
    cronJob.stop();
    cronJob = null;
    console.log('Scheduled job stopped');
  }
}

// For development testing, manually trigger the job
export async function manuallyTriggerJob() {
  console.log('Manually triggering job:', new Date().toISOString());
  try {
    await fetchAndStoreAllCategories();
    return true;
  } catch (error) {
    console.error('Error in manual job trigger:', error);
    return false;
  }
}