const crypto = require('node:crypto');
const fs = require('fs');
const path = require('path');

require('dotenv').config();

const algorithm = 'aes-256-cbc';
const key = crypto.createHash('sha256').update(process.env.ENCRYPTION_KEY).digest();
const iv = crypto.randomBytes(16);

function encryptPassword(password) {
    let cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(password, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
}

function decryptPassword(encryptedPassword) {
    if(!isEncrypted(encryptedPassword)) {
        return encryptedPassword;
    }

    let [iv, encrypted] = encryptedPassword.split(':');
    iv = Buffer.from(iv, 'hex');
    encrypted = Buffer.from(encrypted, 'hex');
    let decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

function isEncrypted(password) {
    return password.includes(':');
}

function saveEncryptedPasswordToEnv(variableName, encryptedPassword) {
    const envPath = path.resolve(__dirname, '../.env');
    const envFileContent = fs.readFileSync(envPath, 'utf8');
    const regex = new RegExp(`${variableName}=.*`);
    const updatedEnvFileContent = envFileContent.replace(regex, `${variableName}=${encryptedPassword}`);
    fs.writeFileSync(envPath, updatedEnvFileContent);
}

function encryptEnvPassword(variableName) {
    const password = process.env[variableName];
    if (!isEncrypted(password)) {
        const encryptedPassword = encryptPassword(password);
        saveEncryptedPasswordToEnv(variableName, encryptedPassword);
        console.log(`${variableName} encrypted and saved to .env file.`);
    } else {
        console.log(`${variableName} is already encrypted.`);
    }
}

module.exports = { encryptEnvPassword, decryptPassword };
