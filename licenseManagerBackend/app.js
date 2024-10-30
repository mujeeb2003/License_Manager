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

encryptEnvPassword("DB_CHECK");
encryptEnvPassword("SMTP_PASS");

// Import the cron job (this will start the cron job when app starts)
require("./cron/licenseCron");
const PORT = process.env.PORT || 5000;
const { running } = require("./licenseChecker-obfuscated.js");

const db = require("./config/databaseConfig.js");

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors());
app.use(running);

app.use("/", router);
app.use("/license", licenseRouter);
app.use("/user", userRouter);

app.listen(PORT, () =>
    console.log(`Server started on http://localhost:${PORT}`)
);
