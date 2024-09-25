const { LocalStorage } = require('node-localstorage'); // Use node-localstorage
const crypto = require('node:crypto');
require("dotenv").config();
const localStorage = new LocalStorage('./middlewares/scratch'); // Path where localStorage data will be stored
const { Log } = require("./models/index");
// // Function to generate a license key
const fs = require('fs');
// function generateLicenseKey(data, secret) {
//     console.log(data,secret);
//     const jsonData = JSON.stringify(data);
//     const hash = crypto.createHmac('sha256', secret).update(jsonData).digest('hex');
//     localStorage.setItem('license',Buffer.from(`${jsonData}.${hash}`).toString('base64'));
//     return Buffer.from(`${jsonData}.${hash}`).toString('base64');
// }

// // Example usage
// const licenseData = {
//     user: 'John Doe',
//     validUntil: '2024-12-31',
//     allowedUsers: 10
// };

// const secret = process.env.SECRET_KEY; // Keep this secret on your server
// const licenseKey = generateLicenseKey(licenseData, secret);

// console.log('Generated License:', licenseKey);





// Function to verify the license key
// function verifyLicenseKey(licenseKey, secret) {
//     try {
//         console.log(licenseKey,secret);
//         const decoded = Buffer.from(licenseKey, 'base64').toString('ascii');
//         const [jsonData, providedHash] = decoded.split('.');
//         const validHash = crypto.createHmac('sha256', secret).update(jsonData).digest('hex');

//         if (validHash !== providedHash) {
//             throw new Error('Invalid license hash');
//         }

//         const licenseData = JSON.parse(jsonData);

//         // Check expiration
//         const currentDate = new Date();
//         const expirationDate = new Date(licenseData.validUntil);

//         if (currentDate > expirationDate) {
//             throw new Error('License expired');
//         }

//         // Check other conditions (allowed users, etc.)
//         return licenseData;
//     } catch (error) {
//         console.error('License verification failed:', error.message);
//         return false;
//     }
// }

// Function to check the license file
function checkLicenseFile() {
    try {
        const licenseFilePath = './config/license.key';
        if (!fs.existsSync(licenseFilePath)) {
            console.error('License file is missing. Please restore the license.');
            process.exit(1); // Exit the application
        }

        const licenseKey = fs.readFileSync(licenseFilePath, 'utf8');
        // Save license to localStorage
        const storedLicense = localStorage.getItem('license') || "";
        if (storedLicense && storedLicense !== licenseKey) {
            console.error('License file has been tampered with. Terminating.');
            process.exit(1);
        }
        const secretkey = process.env.SECRET_KEY;

        const licenseData = verifyLicenseKey(licenseKey, secretkey);

        if (!licenseData) {
            console.error('Invalid license. Terminating.');
            process.exit(1);
        }

        // localStorage.setItem('license', licenseKey); // Save license to localStorage

        return licenseData;
    } catch (error) {
        console.error(error.message);
    }
}

// Verify the license when the application starts
module.exports.running = async (req, res, next) => {
    try {
        const licenseData = checkLicenseFile();

    if (!licenseData) {
        Log.create({ user_id: 0, license_id: null, description: 'Invalid or expired license. Terminating application.' });
        console.error('Invalid or expired license. Terminating application.');
        res.status(400).send({error:'Invalid or expired license. Terminating application.'});
        process.exit(1); // Exit the application if license is invalid
    }

    next();
        
    } catch (error) {
        console.error(error.message);
    }
}

