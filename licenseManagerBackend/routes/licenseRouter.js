const licenseRouter = require('express').Router();
const { License } = require('../models/index');
const { getLicenses,createLicense, deleteLicense, editLicense,getLicExpiry } = require("../controllers/licenseController.js");
const { isLoggedIn, isAdmin } = require("../middlewares/isLoggedin.js");

licenseRouter.get("/getLicenses",isLoggedIn,getLicenses);

licenseRouter.post("/createLicense", isLoggedIn, isAdmin, createLicense);

licenseRouter.post("/deleteLicense",isLoggedIn, isAdmin,deleteLicense);

licenseRouter.post("/editLicense", isLoggedIn, isAdmin, editLicense);

licenseRouter.get("/getLicenseNot",isLoggedIn,getLicExpiry);

module.exports = licenseRouter;

