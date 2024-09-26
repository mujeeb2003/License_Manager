const crypto = require("node:crypto");
const fs = require("fs");
const os = require("os");

// Function to get a unique hardware identifier
function getHardwareId() {
    const cpu = os.cpus()[0].model;
    const network = Object.values(os.networkInterfaces())
        .flat()
        .filter(({ family, internal }) => family === "IPv4" && !internal)
        .map(({ mac }) => mac);
    let hdd;
    try {
        // Try Windows-specific method
        const { execSync } = require("child_process");
        const output = execSync("wmic diskdrive get SerialNumber").toString();
        const serialNumber = output.split("\n")[1].trim();
        hdd = crypto.createHash("sha256").update(serialNumber).digest("hex");
    } catch (error) {
        try {
            // Try Linux-specific method
            const { execSync } = require("child_process");
            const output = execSync("lsblk -ndo serial").toString();
            const serialNumber = output.trim();
            hdd = crypto
                .createHash("sha256")
                .update(serialNumber)
                .digest("hex");
        } catch (error) {
            // Fallback to hostname if both methods fail
            hdd = crypto
                .createHash("sha256")
                .update(os.hostname())
                .digest("hex");
        }
    }
    return crypto
        .createHash("sha256")
        .update(`${cpu}${network.join()}${hdd}`)
        .digest("hex");
}

// Add this function
function deriveSecretKey() {
    const hardwareInfo = getHardwareId();
    return crypto.createHash("sha256").update(hardwareInfo).digest();
}

// Add this function to generate a key pair
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

// Function to encrypt the license
function encryptLicense(license, key) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv);
    let encrypted = cipher.update(JSON.stringify(license), "utf8", "hex");
    encrypted += cipher.final("hex");
    return iv.toString("hex") + ":" + encrypted;
}

// Function to decrypt the license file
function decryptLicense(encryptedLicense, key) {
    const [ivHex, encryptedData] = encryptedLicense.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const decipher = crypto.createDecipheriv(
        "aes-256-cbc",
        Buffer.from(key),
        iv
    );
    let decrypted = decipher.update(encryptedData, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return JSON.parse(decrypted);
}

// Modify the verifySignature function
function verifySignature(data, signature, publicKey) {
    const verify = crypto.createVerify("SHA256");
    verify.update(JSON.stringify(data));
    return verify.verify(publicKey, signature, "base64");
}

module.exports = {
    getHardwareId,
    deriveSecretKey,
    generateKeyPair,
    encryptLicense,
    decryptLicense,
    verifySignature,
};
