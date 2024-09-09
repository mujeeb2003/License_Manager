const jwt = require("jsonwebtoken");

module.exports.generateToken = (user)=>{
    jwt.sign({user},process.env.SECRET_KEY);
}