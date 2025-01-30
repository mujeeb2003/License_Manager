// licenseChecker.js
const fs = require('fs');
const path = require('path');
const {
    getHardwareId,
    deriveSecretKey,
    decryptLicense,
    verifySignature
} = require('./license');

function checkLicenseFile() {
    try {
        const licenseFilePath = path.join(process.cwd(), 'config', 'license.enc');
        if (!fs.existsSync(licenseFilePath)) {
            throw new Error('License file is missing. Please restore the license.');
        }

        const encryptedLicense = fs.readFileSync(licenseFilePath, 'utf8');
        const secretKey = deriveSecretKey();
        const license = decryptLicense(encryptedLicense, secretKey);

        if (!verifySignature(license.data, license.signature, license.data.publicKey)) {
            throw new Error('License signature is invalid');
        }

        if (license.data.hardwareId !== getHardwareId()) {
            throw new Error('License is not valid for this hardware');
        }

        if (new Date() > new Date(license.data.expirationDate)) {
            throw new Error('License has expired');
        }

        return license.data;
    } catch (error) {
        throw new Error(`License verification failed: ${error.message}`);
    }
}

function running(req, res, next) {
    try {
        const licenseData = checkLicenseFile();
        if (!licenseData) {
            console.error('Invalid or expired license. Terminating application.');
            return res.status(400).json({
                error: 'Invalid or expired license. Terminating application.'
            });
        }
        next();
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            error: 'An error occurred while verifying the license.'
        });
    }
}

module.exports = { running, checkLicenseFile };

// For testing
console.log(checkLicenseFile());