const { License, User, Vendor,Category, Status } = require("../models/index.js");

module.exports.getLicenses = async (req,res) => {
    try {
        const licenses = await License.findAll({
            attributes:{
                exclude:['createdAt','updatedAt',"user_id","vendor_id","category_id","status_id"],
            },
            include:[
                {
                    model:User,
                    attributes:["username"]
                },
                {
                    model:Vendor,
                    attributes:["vendor_name"]
                },
                {
                    model:Category,
                    attributes:["category_name"]
                },
                {
                    model:Status,
                    attributes:["status_name"]
                },
            ],
            raw:true,
            order:[["expiry_date","ASC"]]
        });
        
        if(!licenses) return res.status(400).send({error:"Licenses not found"});
        
        return res.status(200).send({licenses});
        
    } catch (error) {
        return res.status(500).send({error:error.message});
    }
}

module.exports.createLicense = async (req,res) => {
    const {title, expiry_date, "Vendor.vendor_id": vendor_id, "Category.category_id":category_id} = req.body;
    const user = req.user;
    
    try {
        
        if(!title || !expiry_date || !vendor_id || !category_id) return res.status(400).send({error:"All fields are required"});
        
        let status_id = 1;
        const today = new Date();
        const oneMonthFromNow = new Date(today.setMonth(today.getMonth() + 1));
        if(new Date(expiry_date) < oneMonthFromNow) status_id = 2;
        
        let license = await License.create({title,expiry_date,vendor_id,category_id,status_id,user_id:user.user_id});
        
        license = await License.findOne({where:{license_id:license.license_id},
            attributes:{
                exclude:['createdAt','updatedAt',"user_id","vendor_id","category_id","status_id"],
            },
            include:[
                {
                    model:User,
                    attributes:["username"]
                },
                {
                    model:Vendor,
                    attributes:["vendor_name"]
                },
                {
                    model:Category,
                    attributes:["category_name"]
                },
                {
                    model:Status,
                    attributes:["status_name"]
                },
            ],
            raw:true,
            order:[["expiry_date","ASC"]]
        })
        
        if(!license) return res.status(400).send({error:"License could not be created"});
        
        return res.status(200).send({license});
    } catch (error) {
        return res.status(500).send({error:error.message});
    }
    
}

module.exports.deleteLicense = async (req,res) => {
    const {license_id} = req.body;
    try {
        const license = await License.destroy({where:{license_id}});
        
        if(!license) return res.status(400).send({error:"License not found"});
        
        return res.status(200).send({license:{license_id:license_id},message:"License Deleted Successfully"});
        
    } catch (error) {
        return res.status(500).send({error:error.message});
    }
}

module.exports.editLicense = async (req,res) => {
    const {license_id , title, expiry_date, "Vendor.vendor_id": vendor_id, "Category.category_id":category_id} = req.body;
    const user_id = req.user.user_id;
    
    try {
        let license = await License.findOne({where:{license_id}});
        
        if(!license) return res.status(404).send({error:"License not found"});
        
        license.title= title;
        license.expiry_date = expiry_date;
        license.vendor_id = vendor_id;
        license.category_id = category_id;
        
        await license.save();
        
        license = await License.findOne({where:{license_id:license.license_id},
            attributes:{
                exclude:['createdAt','updatedAt',"user_id","vendor_id","category_id","status_id"],
            },
            include:[
                {
                    model:User,
                    attributes:["username"]
                },
                {
                    model:Vendor,
                    attributes:["vendor_name"]
                },
                {
                    model:Category,
                    attributes:["category_name"]
                },
                {
                    model:Status,
                    attributes:["status_name"]
                },
            ],
            raw:true,
            order:[["expiry_date","ASC"]]
        });
        
        return res.status(200).send({license});
    } catch (error) {
        return res.status(500).send({error:error.message});
    }
    
}