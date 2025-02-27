const userRouter = require("express").Router();
const { User } = require("../models/index");
const {
    login,
    register,
    getLoggedinUser,
    logoutUser,
    userDisable,
    toggleAdmin,
    resetPassword,
    updateUser,
    getAllUsers,
    assignDomain,
    addUser,
    checkSuperAdmin
} = require("../controllers/userController");
const { isLoggedIn, isAdmin } = require("../middlewares/isLoggedin.js");

userRouter.post("/register", register);

userRouter.post("/login", login);

userRouter.get("/getLoggedinUser", isLoggedIn, getLoggedinUser);

userRouter.get("/logoutUser", isLoggedIn, logoutUser);

userRouter.post("/toggleDisable", isLoggedIn, isAdmin, userDisable);

userRouter.post("/toggleAdmin", isLoggedIn, isAdmin, toggleAdmin);

userRouter.post("/resetPassword", isLoggedIn, isAdmin, resetPassword);

userRouter.post("/updateUser", isLoggedIn, updateUser);

userRouter.post("/assignDomain", isLoggedIn, isAdmin, assignDomain);

userRouter.post("/addUser", isLoggedIn, isAdmin, addUser);

userRouter.get("/getAllUsers", isLoggedIn, isAdmin, getAllUsers);

userRouter.get("/checkSuperAdmin", checkSuperAdmin);
module.exports = userRouter;
