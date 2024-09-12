const { Category, Vendor, License} = require("../models/index.js");

module.exports.getLicenseopt = async(req,res) => {
    try {
        const categories = await Category.findAll();
        const vendors = await Vendor.findAll();
        
        if(!categories || !vendors) return res.status(400).send({error:"Something Went Wrong"});
        
        return res.status(200).send({categories,vendors});
        
    } catch (error) {
        
        return res.status(500).send({error:error.message});
        
    }
}

module.exports.createVendor = async(req,res) => {
    const {vendor_name,vendor_email,vendor_representative,vendor_rep_phone,vendor_rep_email} = req.body;
    
    try {
        if(!vendor_name || !vendor_email || !vendor_representative || !vendor_rep_phone || !vendor_rep_email) return res.status(400).send({error:"All fields are required"});
        
        const vendor = await Vendor.create({vendor_name,vendor_email,vendor_representative,vendor_rep_phone,vendor_rep_email});
        
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
        const license = await License.findOne({where:{vendor_id}});
        
        if(license) return res.status(400).send({error:"Cannot Delete Vendor, Vendor has licenses"});
        
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
        const license = await License.findOne({where:{category_id}});
        
        if(license) return res.status(400).send({error:"Cannot Delete Category, Category has licenses"});
        
        const category = await Category.destroy({where:{category_id}});
        
        if(!category) return res.status(400).send({error:"Category not found"});
        
        return res.status(200).send({category:{category_id:category_id},message:"Category Deleted Successfully"});
        
    } catch (error) {
        return res.status(500).send({error:error.message});
    }
}

module.exports.editVendor = async (req,res) => {
    const {vendor_id,vendor_name,vendor_email,vendor_representative,vendor_rep_phone,vendor_rep_email} = req.body;
    const user_id = req.user.user_id;
    
    try {
        let vendor = await Vendor.findOne({where:{vendor_id}});
        
        if(!vendor) return res.status(404).send({error:"Vendor not found"});
        
        vendor.vendor_name = vendor_name,
        vendor.vendor_email = vendor_email,
        vendor.vendor_representative = vendor_representative,
        vendor.vendor_rep_phone = vendor_rep_phone,
        vendor.vendor_rep_email = vendor_rep_email
        
        await vendor.save();
        
        return res.status(200).send({vendor});
        
    } catch (error) {
        return res.status(500).send({error:error.message});
    }
    
}

module.exports.editCategory = async (req,res) => {
    const { category_id, category_name } = req.body;
    const user_id = req.user.user_id;
    
    try {
        let category = await Category.findOne({where:{category_id}});
        
        if(!category) return res.status(404).send({error:"Category not found"});
        
        category.category_name = category_name
        
        await category.save();
        
        return res.status(200).send({category});
    } catch (error) {
        return res.status(500).send({error:error.message});
    }
    
}