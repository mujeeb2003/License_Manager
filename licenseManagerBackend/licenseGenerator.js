// licenseGenerator.js
const crypto = require('crypto');
const fs = require('fs');
const readline = require('readline');
const bcrypt = require('bcryptjs');
const path = require('path');

const {
    getHardwareId,
    generateKeyPair,
    deriveSecretKey,
    encryptLicense
} = require('./license');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const GENERATION_PASSWORD = '$2a$12$jc4xgY6aJv9SvXkW6HkCVuyny5yullfdzAQxkuV26ErAfYtEGMacO';

function promptUser() {
    rl.stdoutMuted = true;
    rl.question('Enter the generation password: ', (password) => {
        bcrypt.compare(password, GENERATION_PASSWORD, (err, same) => {
            if (err) throw err;
            if (!same) {
                console.log('Incorrect password. Exiting.');
                rl.close();
                return;
            }
            rl.stdoutMuted = false;

            rl.question('Enter client name: ', (clientName) => {
                rl.question('Enter expiration date (YYYY-MM-DD): ', (expirationDate) => {
                    generateAndSaveLicense(clientName, expirationDate);
                    rl.close();
                });
            });
        });
    });

    rl._writeToOutput = function _writeToOutput(stringToWrite) {
        if (rl.stdoutMuted) rl.output.write('*');
        else rl.output.write(stringToWrite);
    };
}

function generateLicense(clientName, expirationDate) {
    const { publicKey, privateKey } = generateKeyPair();
    const hardwareId = getHardwareId();
    const licenseData = {
        clientName,
        expirationDate,
        hardwareId,
        issuedAt: new Date().toISOString(),
        publicKey
    };

    const sign = crypto.createSign('SHA256');
    sign.update(JSON.stringify(licenseData));
    const signature = sign.sign(privateKey, 'base64');

    return { data: licenseData, signature };
}

function generateAndSaveLicense(clientName, expirationDate) {
    try {
        const license = generateLicense(clientName, expirationDate);
        const secretKey = deriveSecretKey();
        const encryptedLicense = encryptLicense(license, secretKey);
        
        // Ensure config directory exists
        const configDir = path.join(process.cwd(), 'config');
        if (!fs.existsSync(configDir)) {
            fs.mkdirSync(configDir, { recursive: true });
        }

        fs.writeFileSync(path.join(configDir, 'license.enc'), encryptedLicense);
        console.log('License generated and saved successfully.');
    } catch (error) {
        console.error('Failed to generate license:', error.message);
        process.exit(1);
    }
}

promptUser();