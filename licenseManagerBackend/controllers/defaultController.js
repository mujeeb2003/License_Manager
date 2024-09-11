const { Category, Status, Vendor} = require("../models/index.js");

module.exports.getLicenseopt = async(req,res) => {
    try {
        const categories = await Category.findAll();
        const status = await Status.findAll();
        const vendors = await Vendor.findAll();

        if(!categories || !status || !vendors) return res.status(400).send({error:"Something Went Wrong"});

        return res.status(200).send({categories,status,vendors});
        
    } catch (error) {

        return res.status(500).send({error:error.message});
        
    }
}

module.exports.createVendor = async(req,res) => {
    const {vendor_name} = req.body;

    try {
        const vendor = await Vendor.create({vendor_name});

        if(!vendor) return res.status(400).send({error:"Vendor not created"});

        return res.status(200).send({vendor});

    } catch (error) {
        return res.status(500).send({error:error.message});
    }
}

module.exports.createCategory = async(req,res) => {
    const {category_name} = req.body;

    try {
        const category = await Category.create({category_name});

        if(!category) return res.status(400).send({error:"Category not creted"});

        return res.status(200).send({category});

    } catch (error) {
        return res.status(500).send({error:error.message});
    }
}

module.exports.deleteVendor = async (req,res) => {
    const {vendor_id} = req.body;
    try {
        const vendor = await Vendor.destroy({where:{vendor_id}});
        
        if(!vendor) return res.status(400).send({error:"Vendor not found"});

        return res.status(200).send({vendor:{vendor_id:vendor_id},message:"Vendor Deleted Successfully"});

    } catch (error) {
        return res.status(500).send({error:error.message});
    }
}

module.exports.deleteCategory = async (req,res) => {
    const {category_id} = req.body;
    try {
        const category = await Category.destroy({where:{category_id}});
        
        if(!category) return res.status(400).send({error:"Category not found"});

        return res.status(200).send({category:{category_id:category_id},message:"Category Deleted Successfully"});

    } catch (error) {
        return res.status(500).send({error:error.message});
    }
}