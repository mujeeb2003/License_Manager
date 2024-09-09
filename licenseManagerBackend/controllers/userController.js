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
                const token = generateToken(user);
                req.cookies.token = token;
                res.status(200).send({user,token});
                
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
        if(!user) return res.status(400).send({error:"Email or password is incorrect"});

        const match = await bcrypt.compare(password,user.password);
        if(!match) return res.status(400).send({error:"Email or password is incorrect"});

        const token = generateToken(user);
        req.cookies.token = token;
        res.status(200).send({user,token,message:"login successfull"});

    } catch (error) {
        return res.status(500).send({error:error.message});
    }
}