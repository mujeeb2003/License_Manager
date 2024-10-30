const { License, User, Vendor,Category, Status,Log, Manager } = require("../models/index.js");
const { Op } = require("sequelize")
const { sendNotificationEmail } = require("../utils/sendEmailNotification.js");

module.exports.getLicenses = async (req,res) => {
    try {
        const licenses = await License.findAll({
            attributes:{
                exclude:['createdAt','updatedAt',"user_id","vendor_id","category_id","status_id","manager_id"],
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
                {
                    model:Manager,
                    attributes:["name","email"]
                }
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
    const {title, expiry_date, "Vendor.vendor_id": vendor_id, "Category.category_id":category_id,"Manager.manager_id": manager_id} = req.body;
    const user = req.user;
    
    try {
        
        if(!title || !expiry_date || !vendor_id || !category_id) return res.status(400).send({error:"All fields are required"});
        
        let status_id = 1;
        const today = new Date();
        const oneMonthFromNow = new Date(today.setMonth(today.getMonth() + 1));
        if(new Date(expiry_date) < oneMonthFromNow) status_id = 2;
        
        let license = await License.create({title,expiry_date,vendor_id,category_id,status_id,user_id:user.user_id,manager_id});
        
        license = await License.findOne({where:{license_id:license.license_id},
            attributes:{
                exclude:['createdAt','updatedAt',"user_id","vendor_id","category_id","status_id","manager_id"],
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
                {
                    model:Manager,
                    attributes:["name","email"]
                }
            ],
            raw:true,
            order:[["expiry_date","ASC"]]
        })
        
        if(!license) return res.status(400).send({error:"License could not be created"});
        
        await Log.create({
            user_id: user.user_id,
            license_id: license.license_id,
            description: `License ${license.title} -- ${license["Vendor.vendor_name"]} created`,
            action_type: `Created by ${license["User.username"]}`,
        });
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
    const {license_id , title, expiry_date, "Vendor.vendor_id": vendor_id, "Category.category_id":category_id,"Manager.manager_id":manager_id} = req.body;
    const user_id = req.user.user_id;
    
    try {
        let license = await License.findOne({where:{license_id}});
        
        if(!license) return res.status(404).send({error:"License not found"});
        
        let status_id = 1;
        const today = new Date();
        const oneMonthFromNow = new Date(today.setMonth(today.getMonth() + 1));
        if(new Date(expiry_date) < oneMonthFromNow) status_id = 2;
        
        
        license.title= title;
        license.expiry_date = expiry_date;
        license.vendor_id = vendor_id;
        license.category_id = category_id;
        license.status_id = status_id;
        license.manager_id = manager_id;
        
        await license.save();
        
        license = await License.findOne({where:{license_id:license.license_id},
            attributes:{
                exclude:['createdAt','updatedAt',"user_id","vendor_id","category_id","status_id","manager_id"],
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
                {
                    model:Manager,
                    attributes:["name","email"]
                },
            ],
            raw:true,
            order:[["expiry_date","ASC"]]
        });
        
        await Log.create({
            user_id: user_id,
            license_id: license.license_id,
            description: `License ${license.title} -- ${license["Vendor.vendor_name"]} updated`,
            action_type: `Updated by ${license["User.username"]}`,
        });
        
        return res.status(200).send({license});
    } catch (error) {
        return res.status(500).send({error:error.message});
    }
    
}

module.exports.checkExpiringLicenses = async () => {
    const licensesAboutToExpire = await License.findAll({
        where: {
            expiry_date: {
                [Op.lte]: new Date(new Date().setDate(new Date().getDate() + 30)) // Licenses expiring in 30 days
            }
        },
        include: [
            { model: User, attributes: ['email', 'username'] },
            { model: Manager, attributes:["email"] }
        ]
    });
    const superAdmin = await User.findOne({where:{isSuperAdmin:true}});

    licensesAboutToExpire.forEach(license => {
        // const { username: userName, email } = license.User.email;
        const subject = `License Expiry Notification: ${license.title}`;
        const message = `Dear All,\nThe license ${license.title} is about to expire on ${license.expiry_date}.\n\nPlease take the necessary actions.`;
        sendNotificationEmail([license.Manager.email,superAdmin.email], subject, message);
    });

    const allLicenses = await License.findAll();
    allLicenses.forEach(license => {
        this.updateLicenseExpiry(license);
    })
};

module.exports.updateLicenseExpiry = async (license) =>{
    const today = new Date();
    if(license.expiry_date < today){
        license.status_id = (await Status.findOne({where:{status_name:"Expired"}})).status_id;
    } else if (license.expiry_date < new Date(today.setMonth(today.getMonth() + 1))) {
        license.status_id = (await Status.findOne({where:{status_name:"Near to Expiry"}})).status_id;
    }
    await license.save();
}

module.exports.getLicExpiry = async (req,res) =>{
    try {
        const licExpInWeek = await License.findAll({where:{
            expiry_date:{
                [Op.lte]:new Date(new Date().setDate(new Date().getDate() + 7))
            }
        },
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
        });
    
        const newLic = (await License.findAll({
            order:[["createdAt","ASC"]],
            where:{
                createdAt:{
                    [Op.gte]:new Date().setHours(0,0,0,0),
                    [Op.lte]:new Date().setHours(23,59,59,999)
                }
            },
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
        }));
    
        return res.status(200).send({licExpInWeek,newLic});
    
    } catch (error) {
        return res.status(500).send({error:error.message});
    }
}