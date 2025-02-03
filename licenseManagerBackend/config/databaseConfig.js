const {Sequelize} = require("sequelize");
require("dotenv").config();
// const { decryptPassword } = require("../utils/encryptPassword.js");

// const dbConfig = {
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     pass: decryptPassword(process.env.DB_CHECK),
//     port: process.env.DB_PORT
// };

const db = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: true
    },
    pool: {
        max: 2,
        min: 0,
        idle: 0,
        acquire: 3000,
        evict: 30000,
    },
    define: {
        timestamps: true
    },
    logging: console.log // Enable logging temporarily for debugging
});

(async () => {
    try {
        await db.authenticate();
        
        console.log("Database connection has been established successfully.");
        // Sync all models
        await db.sync({ alter: true }); // { force: true } if you want to drop existing tables
    } catch (error) {
        console.error('Error synchronizing the database:', error);
    }
})();

module.exports = db;