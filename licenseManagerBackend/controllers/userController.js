const {User} = require('../models/index.js');
const {generateToken} = require("../utils/generateToken.js");
const bcrypt = require("bcrypt");

module.exports.register = async (req,res)=>{
    const {username,email,password} = req.body;
    try {
        let userlength = await User.findAll();
        
        let user = await User.findOne({where:{email}});
        if(user) return res.status(400).send({error:"Email already in use"});
        
        bcrypt.genSalt(10,(err,salt)=>{
            if(err) return res.status(400).send({error:err.message});
            bcrypt.hash(password,salt,async (err,hash)=>{
                
                if(err) return res.status(400).send({error:err.message});
                
                user = await User.create({username,email,password:hash,isAdmin:userlength==0?true:false,isSuperAdmin:userlength==0?true:false});
                
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
        
        if(user.isDisable) return res.status(400).send({error:"User is Disabled"});
        
        const token = generateToken(user);
        res.cookie("token", token, { httpOnly: true, secure: true });
        
        res.status(200).send({user:{email:user.email,username:user.username,user_id:user.user_id,isAdmin:user.isAdmin,isSuperAdmin:user.isSuperAdmin},message:"login successfull"});
        
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

module.exports.toggleAdmin = async (req,res) => {
    const { user_id } = req.body;
    try {
        const user = await User.findByPk(user_id);
        
        if(!user) return res.status(404).send({error:'User not found'});
        
        user.isAdmin = !user.isAdmin;
        
        await user.save();
        
        return res.send({user,message:"User update successfull"});
    } catch (error) {
        return res.status(500).send({error:error.message})
    }
}

module.exports.userDisable = async(req,res)=> {
    const {user_id} = req.body;
    try {
        const user = await User.findByPk(user_id);
        
        if(!user) return res.status(404).send({error:'User not found'});
        
        user.isDisable = !user.isDisable;
        
        await user.save();
        
        return res.send({user,message:"User update successfull"});
    } catch (error) {
        return res.status(500).send({error:error.message})
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

module.exports.resetPassword = async(req,res) => {
    const {user_id,password} = req.body;
    const user = req.user;
    
    try {
        
        if(!user.isSuperAdmin) return res.status(402).send({error:"Only Super admins can reset password"});
        
        bcrypt.genSalt(10,(err,salt)=>{
            if(err) return res.status(400).send({error:err.message});

            bcrypt.hash(password,salt, async(err,hash)=>{
                if(err) return res.status(400).send({error:err.message});

                const user = await User.findByPk(user_id);

                if(!user) return res.status(404).send({error:"User not found"});

                user.password = hash;

                await user.save();

                return res.status(200).send({message:"Password successfully reset."});
            })
        })
    } catch (error) {
        return res.status(500).send({error:error.message});
    }
    
}

module.exports.updateUser = async (req,res) => {
    const {user_id,password,username} = req.body;

    try {
        const user = await User.findByPk(user_id);

        if(!user) return res.status(404).send({error:"User not found"});

        bcrypt.genSalt(10,(err,salt)=>{
            if(err) return res.status(400).send({error:err.message});
            bcrypt(password,salt,async (err,hash)=>{
                if(err) return res.status(400).send({error:err.message});

                user.username = username;
                user.password = hash;

                let newuser = {
                    user_id:user.user_id,
                    email:user.email,
                    username:user.username,
                    isAdmin:user.isAdmin,
                    isSuperAdmin:user.isSuperAdmin,
                    isDisable:user.isDisable
                }
                await user.save();

                return res.status(200).send({user:newuser,message:"Update Successfull"});
            })
        })
    } catch (error) {
        return res.status(500).send({error:error.message});
    }
}

module.exports.getAllUsers = async(req,res) => {
    try {
        const users = await User.findAll();

        if(!users) return res.status(400).send({error:"No users found"});

        return res.status(200).send({users});

    } catch (error) {
        return res.status(500).send({error:error.message});
    }
}