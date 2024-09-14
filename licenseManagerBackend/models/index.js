const db = require("../config/databaseConfig.js");
const User = require('./userModel.js')
const Status = require('./statusModel.js')
const Vendor = require('./vendorModel.js')
const License = require('./licenseModel.js')
const Category = require('./categoryModel.js')
const Log = require('./logsModel.js')

const syncDatabase = async (force = false) => {
    try {
        
        await db.authenticate();
        
        //   await db.query('SET FOREIGN_KEY_CHECKS = 0');
        
        const models = [User,Status,Vendor,Category,License,Log];
        for (const model of models) {
            await model.sync({ force });
        }
        //   await db.query('SET FOREIGN_KEY_CHECKS = 1');
        
        // User.sync({alter:true});

        License.belongsTo(User, { foreignKey: 'user_id' });
        License.belongsTo(Vendor, { foreignKey: 'vendor_id' });
        License.belongsTo(Category, { foreignKey: 'category_id' });
        License.belongsTo(Status, { foreignKey: 'status_id' });
        Log.belongsTo(User, { foreignKey: 'user_id' });
        Log.belongsTo(License, { foreignKey: 'user_id' });
        
        if (force) {
            await seedData();
        }
        
    } catch (error) {
        console.error('Error synchronizing the database:', error);
    }
};

const seedData = async () => {
    await Category.bulkCreate([
        { category_name: 'default' }
    ]);
    await Status.bulkCreate([
        { status_name: 'Up to Date' },
        { status_name: 'Near to Expiry' },
        { status_name: 'Expired' }
    ]);
    
    // console.log('Data seeded successfully.');
};
// seedData();
syncDatabase(false);

module.exports = {
    User,
    Status,
    Vendor,
    License,
    Category,
    Log,
    db
}