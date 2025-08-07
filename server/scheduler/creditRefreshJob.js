const cron = require('node-cron');
const db = require('../db');

/**
 * Updates all users to add 100 credits to their award_balance.
 */
const refreshMonthlyCredits = async () => {
  console.log('Running monthly credit refresh job...');
  try {
    const [results] = await db.execute(
      'UPDATE users SET award_balance = award_balance + 100'
    );
    console.log(`Monthly credit refresh complete. ${results.affectedRows} users updated.`);
  } catch (error) {
    console.error('Error running monthly credit refresh job:', error);
  }
};

// Schedule to run at midnight (00:00) on the 1st day of every month.
const task = cron.schedule('0 0 1 * *', refreshMonthlyCredits, {
  scheduled: false,
});

const startCreditRefreshJob = () => {
  console.log('Credit refresh job scheduled for the 1st of every month at midnight.');
  task.start();
};

module.exports = { startCreditRefreshJob, refreshMonthlyCredits };