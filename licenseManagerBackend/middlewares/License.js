const fs = require('fs');
const crypto = require('crypto');
const { LocalStorage } = require('node-localstorage'); // Use node-localstorage

// Set up local storage
const localStorage = new LocalStorage('./scratch'); // Path where localStorage data will be stored

// Function to verify the license key
function verifyLicenseKey(licenseKey, secret) {
    try {
        const decoded = Buffer.from(licenseKey, 'base64').toString('ascii');
        const [jsonData, providedHash] = decoded.split('.');
        const validHash = crypto.createHmac('sha256', secret).update(jsonData).digest('hex');

        if (validHash !== providedHash) {
            throw new Error('Invalid license hash');
        }

        const licenseData = JSON.parse(jsonData);

        // Check expiration
        const currentDate = new Date();
        const expirationDate = new Date(licenseData.validUntil);

        if (currentDate > expirationDate) {
            throw new Error('License expired');
        }

        // Check other conditions (allowed users, etc.)
        return licenseData;
    } catch (error) {
        console.error('License verification failed:', error.message);
        return false;
    }
}

// Function to check the license file
function checkLicenseFile() {
    try {
        const licenseFilePath = '../config/license.key';
        if (!fs.existsSync(licenseFilePath)) {
            console.error('License file is missing. Please restore the license.');
            process.exit(1); // Exit the application
        }

        const licenseKey = fs.readFileSync(licenseFilePath, 'utf8');

        const storedLicense = localStorage.getItem('license') || '';
        if (storedLicense && storedLicense !== licenseKey) {
            console.error('License file has been tampered with. Terminating.');
            process.exit(1);
        }
        const secretkey = process.env.SECRET_KEY;
        console.log(secretkey);

        const licenseData = verifyLicenseKey(licenseKey, secretkey);

        if (!licenseData) {
            console.error('Invalid license. Terminating.');
            process.exit(1);
        }

        localStorage.setItem('license', licenseKey); // Save license to localStorage

        return licenseData;
    } catch (error) {
        console.error(error.message);
    }
}

// Verify the license when the application starts
module.exports.running = async (req, res, next) => {
    const licenseData = checkLicenseFile();

    if (!licenseData) {
        console.error('Invalid or expired license. Terminating application.');
        process.exit(1); // Exit the application if license is invalid
    }

    next();
}

// Check the license file upon module load
const licenseData = checkLicenseFile();

if (!licenseData) {
    console.error('Invalid or expired license. Terminating application.');
    process.exit(1); // Exit the application if license is invalid
}
