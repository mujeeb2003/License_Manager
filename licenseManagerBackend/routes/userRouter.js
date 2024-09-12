const userRouter = require('express').Router();
const { User } = require('../models/index');
const { login,register,getLoggedinUser, logoutUser} = require("../controllers/userController");
const {isLoggedIn } = require("../middlewares/isLoggedin.js");

userRouter.post('/register',register);

userRouter.post('/login',login);

userRouter.get('/getLoggedinUser',isLoggedIn,getLoggedinUser);

userRouter.get('/logoutUser',isLoggedIn,logoutUser);

module.exports = userRouter;
