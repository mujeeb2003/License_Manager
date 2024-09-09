const userRouter = require('express').Router();
const { User } = require('../models/index');
const { login,register} = require("../controllers/userController");

userRouter.post('/register',register);
userRouter.post('/login',login);

module.exports = userRouter;
