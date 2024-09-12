const {User} = require('../models/index.js');
const {generateToken} = require("../utils/generateToken.js");
const bcrypt = require("bcrypt");

module.exports.register = async (req,res)=>{
    const {username,email,password} = req.body;
    try {
        let user = await User.findOne({where:{email}});
        if(user) return res.status(400).send({error:"Email already in use"});
        
        bcrypt.genSalt(10,(err,salt)=>{
            if(err) return res.status(400).send({error:err.message});
            bcrypt.hash(password,salt,async (err,hash)=>{
                if(err) return res.status(400).send({error:err.message});
                
                user = await User.create({username,email,password:hash});
                
                res.status(200).send({user:{email:user.email,username:user.username,user_id:user.user_id},message:"Registered successfull"});
            })
        })
    } catch (error) {
        return res.status(500).send({error:error.message});
    }
}

module.exports.login = async (req,res)=>{
    const {email,password} = req.body;
    try {
        let user = await User.findOne({where:{email}});
        
        if(!user) {
            return res.status(404).send({error:"User not found"});
        }
        const match = await bcrypt.compare(password,user.password);
        if(!match) return res.status(400).send({error:"Email or password is incorrect"});
        
        const token = generateToken(user);
        res.cookie("token", token, { httpOnly: true, secure: true });
        
        res.status(200).send({user:{email:user.email,username:user.username,user_id:user.user_id,isAdmin:user.isAdmin},message:"login successfull"});
        
    } catch (error) {
        return res.status(500).send({error:error.message});
    }
}

module.exports.getLoggedinUser = async(req,res)=>{
    try {
        return res.status(200).send({user:req.user});
    } catch (error) {
        return res.status(500).send({error:error.message});
    }
    
}

module.exports.logoutUser = async (req,res) => {
    try {
        const user = req.user;
        res.clearCookie("token");
        return res.status(200).send({message:"Successfully Logged Out"});
    } catch (error) {
        return res.status(500).send({error:error.message});
    }
}