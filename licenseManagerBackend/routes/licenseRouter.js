const licenseRouter = require('express').Router();
const { License } = require('../models/index');
const { getLicenses,createLicense, deleteLicense } = require("../controllers/licenseController.js");
const { isLoggedIn } = require("../middlewares/isLoggedin.js");

licenseRouter.get("/getLicenses",isLoggedIn,getLicenses);

licenseRouter.post("/createLicense", isLoggedIn, createLicense);

licenseRouter.post("/deleteLicense",isLoggedIn,deleteLicense);

module.exports = licenseRouter;

