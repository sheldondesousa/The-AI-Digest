import cron from 'node-cron';
import { refreshFeeds } from './feeds.js';

function getNextRunTime() {
  const now = new Date();
  const next = new Date();
  next.setHours(7, 0, 0, 0);
  if (next <= now) next.setDate(next.getDate() + 1);
  return next.toISOString();
}

let nextRunTime = getNextRunTime();

export function getNextRun() {
  return nextRunTime;
}

export function startScheduler() {
  cron.schedule('0 7 * * *', async () => {
    console.log('Running scheduled feed refresh...');
    const count = await refreshFeeds();
    console.log(`Scheduled refresh complete. ${count} new articles.`);
    nextRunTime = getNextRunTime();
  });

  console.log(`Scheduler started. Next run: ${nextRunTime}`);
}
