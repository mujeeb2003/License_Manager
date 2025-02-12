const nodemailer = require("nodemailer");
require("dotenv").config();
const { decryptPassword } = require("../utils/encryptPassword.js");

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: decryptPassword(process.env.SMTP_PASS),
    },
});

const sendNotificationEmail = (email, subject, message) => {
    console.log(email)
    const mailOptions = {
        // Sender address
        from: process.env.SMTP_USER, // Sender address
        to: email.join(", "), // List of recipients
        subject: subject, // Subject line
        html: message, // Plain text body
        
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
    });
};

module.exports = { sendNotificationEmail };
