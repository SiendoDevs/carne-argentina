export function isMarketOperating(): boolean {
  // Get current time in Argentina
  const now = new Date();
  const argTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Argentina/Buenos_Aires' }));
  
  // Check if it's a weekday (Monday = 1, Friday = 5)
  const isWeekday = argTime.getDay() > 0 && argTime.getDay() < 6;
  
  // Check if it's between 8:00 and 20:00
  const hour = argTime.getHours();
  const isOperatingHours = hour >= 8 && hour < 20;
  
  return isWeekday && isOperatingHours;
}

export function getNextMarketOpen(): Date {
  const now = new Date();
  const argTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Argentina/Buenos_Aires' }));
  
  // If it's after hours, move to next day
  if (argTime.getHours() >= 20) {
    argTime.setDate(argTime.getDate() + 1);
  }
  
  // Set to 8 AM
  argTime.setHours(8, 0, 0, 0);
  
  // If it's weekend, move to Monday
  while (argTime.getDay() === 0 || argTime.getDay() === 6) {
    argTime.setDate(argTime.getDate() + 1);
  }
  
  return argTime;
}