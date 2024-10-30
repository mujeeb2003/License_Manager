const router = require('express').Router();
const {} = require('../models/index.js'); 
const { getLicenseopt, createCategory,createVendor,deleteVendor,deleteCategory,editCategory,editVendor,createManager,editManager } = require('../controllers/defaultController.js');
const { isLoggedIn,isAdmin } = require('../middlewares/isLoggedin.js');

router.get("/getLicenseopt",isLoggedIn,getLicenseopt);

router.post("/createVendor",isLoggedIn, isAdmin, createVendor);

router.post("/createCategory",isLoggedIn, isAdmin, createCategory);

router.post("/createManager",isLoggedIn, isAdmin, createManager);

router.post("/deleteVendor",isLoggedIn, isAdmin, deleteVendor);

router.post("/deleteCategory",isLoggedIn, isAdmin, deleteCategory);

router.post("/editVendor",isLoggedIn, isAdmin, editVendor);

router.post("/editCategory",isLoggedIn, isAdmin, editCategory);

router.post("/editManager",isLoggedIn, isAdmin, editManager);

module.exports = router;