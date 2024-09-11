const router = require('express').Router();
const {} = require('../models/index.js'); 
const { getLicenseopt, createCategory,createVendor,deleteVendor,deleteCategory } = require('../controllers/defaultController.js');
const { isLoggedIn } = require('../middlewares/isLoggedin.js');

router.get("/getLicenseopt",isLoggedIn,getLicenseopt);

router.post("/createVendor",isLoggedIn,createVendor);

router.post("/createCategory",isLoggedIn,createCategory);

router.post("/deleteVendor",isLoggedIn,deleteVendor);

router.post("/deleteCategory",isLoggedIn,deleteCategory);

module.exports = router;