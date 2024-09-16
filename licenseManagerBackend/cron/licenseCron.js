// cron/licenseCron.js
const cron = require('node-cron');
const { checkExpiringLicenses } = require("../controllers/licenseController.js");

// Define the cron job
cron.schedule('0  9 * * *', async () => {
    try {
        console.log('Running cron job for license expiration notifications...');
        await checkExpiringLicenses();
        
        console.log(`Sent email notifications.`);
    } catch (error) {
        console.error('Error in cron job:', error);
    }
});
