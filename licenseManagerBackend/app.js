const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const db = require("./config/databaseConfig.js");
const cors = require("cors");
require("dotenv").config();
const licenseRouter = require('./routes/licenseRouter.js');
const userRouter = require('./routes/userRouter.js');
const router = require("./routes/Router.js");
const app = express();


const PORT = process.env.PORT || 5000;

app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.json())
app.use(cors());

app.use('/',router);
app.use('/license',licenseRouter);
app.use('/user',userRouter);


app.listen(PORT,() => console.log(`Server started on http://localhost:${PORT}`))