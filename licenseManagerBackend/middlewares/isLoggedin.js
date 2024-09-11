const jwt = require("jsonwebtoken");

module.exports.isLoggedIn = async (req,res,next) => {
    const token = req.cookies.token;
    try {
        if(!token) return res.status(400).send({error:"Please log in"});
    
        const user = jwt.decode(token,process.env.SECRET_KEY);
        
        console.log(user);

        if(user.exp < Date.now()/1000) return res.status(401).send({error:"jwt token is expired"});
    
        req.user = {email:user.user.email,username:user.user.username,user_id:user.user.user_id};
        next();
    } catch (error) {
        return res.status(500).send({error:error.message});
    }
}