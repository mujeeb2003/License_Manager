const crypto = require("node:crypto");
const fs = require("fs");
const readline = require("readline");
const bcrypt = require("bcrypt");
const {
    getHardwareId,
    deriveSecretKey,
    generateKeyPair,
    encryptLicense,
} = require("./license");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const GENERATION_PASSWORD =
    "$2b$10$w8p1l0pYWuvL2RHeTBfztuwJ3hhcp.Pp1W/PPYAvH15w6F9FusLjW";

function promptUser() {
    rl.stdoutMuted = true;
    rl.question("Enter the generation password: ", (password) => {
        bcrypt.compare(password, GENERATION_PASSWORD, (err, same) => {
            if (err) throw err;
            if (!same) {
                console.log("Incorrect password. Exiting.");
                rl.close();
                return;
            }
            rl.stdoutMuted = false;

            rl.question("Enter client name: ", (clientName) => {
                rl.question(
                    "Enter expiration date (YYYY-MM-DD): ",
                    (expirationDate) => {
                        generateAndSaveLicense(clientName, expirationDate);
                        rl.close();
                    }
                );
            });
        });
    });
    rl._writeToOutput = function _writeToOutput(stringToWrite) {
        if (rl.stdoutMuted) rl.output.write("*");
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
        publicKey,
    };

    const sign = crypto.createSign("SHA256");
    sign.update(JSON.stringify(licenseData));
    const signature = sign.sign(privateKey, "base64");

    return { data: licenseData, signature };
}

function generateAndSaveLicense(clientName, expirationDate) {
    const license = generateLicense(clientName, expirationDate);
    const secretKey = deriveSecretKey();
    const encryptedLicense = encryptLicense(license, secretKey);
    fs.writeFileSync("./config/license.enc", encryptedLicense);
    console.log("License generated and saved successfully.");
}

promptUser();

// bcrypt.genSalt(10, (err, salt) => {
//     if (err) throw err;
//     bcrypt.hash("Qwerty123$", salt, (err, hash) => {
//         if (err) throw err;
//         console.log(hash);
//     });
// });
