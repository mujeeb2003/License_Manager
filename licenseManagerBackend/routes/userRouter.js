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
} = require("../controllers/userController");
const { isLoggedIn, isSuperAdmin, isAdmin } = require("../middlewares/isLoggedin.js");

userRouter.post("/register", register);

userRouter.post("/login", login);

userRouter.get("/getLoggedinUser", isLoggedIn, getLoggedinUser);

userRouter.get("/logoutUser", isLoggedIn, logoutUser);

userRouter.post("/toggleDisable", isLoggedIn, isSuperAdmin, userDisable);

userRouter.post("/toggleAdmin", isLoggedIn, isSuperAdmin, toggleAdmin);

userRouter.post("/resetPassword", isLoggedIn, isSuperAdmin, resetPassword);

userRouter.post("/updateUser", isLoggedIn, updateUser);

userRouter.post("/assignDomain", isLoggedIn, isSuperAdmin, assignDomain);

userRouter.get("/getAllUsers", isLoggedIn, isAdmin, getAllUsers);

module.exports = userRouter;
