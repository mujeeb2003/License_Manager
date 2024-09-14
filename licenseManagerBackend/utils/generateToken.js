const jwt = require("jsonwebtoken");

module.exports.generateToken = (user)=>{
    return jwt.sign({user},process.env.SECRET_KEY,{expiresIn:"30min"});
}