const fs = require("fs");
const {
    getHardwareId,
    deriveSecretKey,
    decryptLicense,
    verifySignature,
} = require("./license");

function checkLicenseFile() {
    try {
        const licenseFilePath = "./config/license.enc";
        if (!fs.existsSync(licenseFilePath)) {
            console.error(
                "License file is missing. Please restore the license."
            );
            process.exit(1);
        }
        

        const encryptedLicense = fs.readFileSync(licenseFilePath, "utf8");
        const secretKey = deriveSecretKey();
        const license = decryptLicense(encryptedLicense, secretKey);

        if (
            !verifySignature(
                license.data,
                license.signature,
                license.data.publicKey
            )
        ) {
            console.error("License signature is invalid. Terminating.");
            process.exit(1);
        }

        if (license.data.hardwareId !== getHardwareId()) {
            console.error(
                "License is not valid for this hardware. Terminating."
            );
            process.exit(1);
        }

        if (new Date() > new Date(license.data.expirationDate)) {
            console.error("License has expired. Terminating.");
            process.exit(1);
        }

        return license.data;
    } catch (error) {
        console.error("License verification failed:", error.message);
        process.exit(1);
    }
}

module.exports.running = async (req, res, next) => {
    try {
        const licenseData = checkLicenseFile();
        if (!licenseData) {
            console.error(
                "Invalid or expired license. Terminating application."
            );
            res.status(400).send({
                error: "Invalid or expired license. Terminating application.",
            });
            process.exit(1);
        }
        next();
    } catch (error) {
        console.error(error.message);
        res.status(500).send({
            error: "An error occurred while verifying the license.",
        });
    }
};

// // This is for testing purposes. Remove or comment out in production.
console.log(checkLicenseFile());
