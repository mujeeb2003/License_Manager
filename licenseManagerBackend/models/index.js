const db = require("../config/databaseConfig.js");
const User = require("./userModel.js");
const Status = require("./statusModel.js");
const Vendor = require("./vendorModel.js");
const License = require("./licenseModel.js");
const Category = require("./categoryModel.js");
const Log = require("./logsModel.js");
const Manager = require("./managerModel.js");
const Domain = require("./domainModel.js");
const DomainVendor = require("./domainvendorModel.js");
// const DomainManager = require("./domainmanagerModel.js");

// Define associations before syncing
// 1. License associations
License.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(License, { foreignKey: "user_id" });

License.belongsTo(Vendor, { foreignKey: "vendor_id" });
Vendor.hasMany(License, { foreignKey: "vendor_id" });

License.belongsTo(Category, { foreignKey: "category_id" });
Category.hasMany(License, { foreignKey: "category_id" });

License.belongsTo(Status, { foreignKey: "status_id" });
Status.hasMany(License, { foreignKey: "status_id" });

License.belongsTo(Manager, { foreignKey: "manager_id" });
Manager.hasMany(License, { foreignKey: "manager_id" });

License.belongsTo(Domain, { foreignKey: "domain_id" });
Domain.hasMany(License, { foreignKey: "domain_id" });

// 2. User-Domain association
User.belongsTo(Domain, { foreignKey: "domain_id" });
Domain.hasMany(User, { foreignKey: "domain_id" });

User.belongsTo(User, { foreignKey: "createdBy" });
User.hasMany(User, { foreignKey: "createdBy" });

// User-Manager association
Manager.belongsTo(User, { foreignKey: "user_id" });
User.hasOne(Manager, { foreignKey: "user_id" });

// 3. Domain-Vendor association
Domain.belongsToMany(Vendor, {
    through: DomainVendor,
    foreignKey: "domain_id",
});
Vendor.belongsToMany(Domain, {
    through: DomainVendor,
    foreignKey: "vendor_id",
});

// 4. Domain-Manager association
Manager.belongsTo(Domain, { foreignKey: "domain_id" });
Domain.hasMany(Manager, { foreignKey: "domain_id" });

// Domain.belongsToMany(Manager, {
//     through: DomainManager,
//     foreignKey: "domain_id",
// });
// Manager.belongsToMany(Domain, {
//     through: DomainManager,
//     foreignKey: "manager_id",
// });

// 5. Log associations
Log.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(Log, { foreignKey: "user_id" });

Log.belongsTo(License, { 
    foreignKey: "license_id", 
    onDelete: "CASCADE", 
    onUpdate: "CASCADE" 
});
License.hasMany(Log, { foreignKey: "license_id" });

const syncDatabase = async (force = false) => {
    try {
        await db.authenticate();

        const models = [
            Domain,
            User,
            Status,
            Vendor,
            Category,
            Manager,
            License,
            Log,
            DomainVendor,
        ];
        
        for (const model of models) {
            await model.sync({ force });
        }

        let categories = await Category.findAll();
        if (force || categories.length === 0) {
            await seedData();
        }
    } catch (error) {
        console.error("Error synchronizing the database:", error);
    }
};

const seedData = async () => {
    await Category.bulkCreate([{ category_name: "default" }]);
    await Status.bulkCreate([
        { status_name: "Up to Date" },
        { status_name: "Near to Expiry" },
        { status_name: "Expired" },
    ]);
    await Domain.bulkCreate([
        { domain_name: "default" },
    ]);
};

// // For local development, sync the database
// if (process.env.NODE_ENV !== 'production') {
    // syncDatabase(false);
// }

module.exports = {
    User,
    Status,
    Vendor,
    License,
    Category,
    Log,
    Manager,
    Domain,
    // DomainManager,
    DomainVendor,
    db
};