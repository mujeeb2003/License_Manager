const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
const licenseRouter = require("./routes/licenseRouter.js");
const userRouter = require("./routes/userRouter.js");
const router = require("./routes/Router.js");
const app = express();
const { encryptEnvPassword } = require("./utils/encryptPassword.js");


const allowedOrigins = ["https://license-manager-cyan.vercel.app","http://localhost:5173"];

encryptEnvPassword("DB_CHECK");
encryptEnvPassword("SMTP_PASS");

require("./cron/licenseCron");
const PORT = process.env.PORT || 5000;
// const { running } = require("./licenseChecker-obfuscated.js");

const db = require("./config/databaseConfig.js");

app.use(
    cors({
        origin: allowedOrigins[0], 
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());

// app.use(running);
app.use("/", router);
app.use("/license", licenseRouter);
app.use("/user", userRouter);

app.listen(PORT, () =>
    console.log(`Server started on http://localhost:${PORT}`)
);
