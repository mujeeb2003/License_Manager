const router = require("express").Router();
const {} = require("../models/index.js");
const {
    getLicenseopt,
    createCategory,
    createVendor,
    deleteVendor,
    deleteCategory,
    editCategory,
    editVendor,
    createManager,
    createDomain,
    deleteDomain,
    editDomain,
    getEligibleManagerUsers,
    removeManager,
} = require("../controllers/defaultController.js");
const { isLoggedIn, isAdmin, isSuperAdmin } = require("../middlewares/isLoggedin.js");

router.get("/getLicenseopt", isLoggedIn, getLicenseopt);

// create routes
router.post("/createVendor", isLoggedIn, isAdmin, createVendor);

router.post("/createCategory", isLoggedIn, isAdmin, createCategory);

router.post("/createManager", isLoggedIn, isAdmin, createManager);

router.post("/createDomain", isLoggedIn, isAdmin, createDomain);

// delete routes
router.post("/deleteVendor", isLoggedIn, isAdmin, deleteVendor);

router.post("/deleteCategory", isLoggedIn, isAdmin, deleteCategory);

router.post("/deleteDomain", isLoggedIn, isSuperAdmin, deleteDomain);

// edit routes
router.post("/editVendor", isLoggedIn, isAdmin, editVendor);

router.post("/editCategory", isLoggedIn, isAdmin, editCategory);

router.post("/removeManager", isLoggedIn, isAdmin, removeManager);

router.post("/editDomain", isLoggedIn, isAdmin, editDomain);

router.get("/getEligibleManagerUsers", isLoggedIn, isAdmin, getEligibleManagerUsers);

module.exports = router;
