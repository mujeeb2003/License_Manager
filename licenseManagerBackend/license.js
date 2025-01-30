// license.js
const crypto = require("crypto");
const fs = require("fs");
const os = require("os");

function getHardwareId() {
    try {
        const cpu = os.cpus()[0].model;

        // Only use the first permanent network adapter's MAC
        // Fix the network interface filter by properly destructuring the mac property
        const network =
            Object.values(os.networkInterfaces())
                .flat()
                .filter(
                    (
                        { family, internal, mac } // Add mac to destructuring
                    ) =>
                        family === "IPv4" &&
                        !internal &&
                        // Filter virtual adapters
                        !/virtual|vmware|vpn/i.test(mac)
                )[0]?.mac || "";

        // Prioritize physical drive serial
        let hdd;
        try {
            const { execSync } = require("child_process");
            if (process.platform === "win32") {
                // Get only physical drive serial
                const output = execSync(
                    "wmic diskdrive where \"MediaType='Fixed hard disk media'\" get SerialNumber",
                    { windowsHide: true }
                ).toString();
                hdd = output.split("\n")[1].trim();
            } else {
                const output = execSync("lsblk -ndo serial /dev/sda", {
                    windowsHide: true,
                }).toString();
                hdd = output.trim();
            }
        } catch (error) {
            hdd = os.hostname();
        }

        return crypto
            .createHash("sha256")
            .update(`${cpu}${hdd}`) // Removed network dependency
            .digest("hex");
    } catch (error) {
        throw new Error(`Hardware ID generation failed: ${error.message}`);
    }
}
function generateKeyPair() {
    return crypto.generateKeyPairSync("rsa", {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: "spki",
            format: "pem",
        },
        privateKeyEncoding: {
            type: "pkcs8",
            format: "pem",
        },
    });
}

function deriveSecretKey() {
    const hardwareId = getHardwareId();
    return crypto.createHash("sha256").update(hardwareId).digest();
}

function encryptLicense(license, key) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    let encrypted = cipher.update(JSON.stringify(license), "utf8", "hex");
    encrypted += cipher.final("hex");
    return `${iv.toString("hex")}:${encrypted}`;
}

function decryptLicense(encryptedLicense, key) {
    const [ivHex, encryptedData] = encryptedLicense.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
    let decrypted = decipher.update(encryptedData, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return JSON.parse(decrypted);
}

function verifySignature(data, signature, publicKey) {
    const verify = crypto.createVerify("SHA256");
    verify.update(JSON.stringify(data));
    return verify.verify(publicKey, signature, "base64");
}

module.exports = {
    getHardwareId,
    generateKeyPair,
    deriveSecretKey,
    encryptLicense,
    decryptLicense,
    verifySignature,
};
