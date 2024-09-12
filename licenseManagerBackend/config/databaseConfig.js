const {Sequelize} = require("sequelize");
require("dotenv").config();

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    pass: process.env.DB_CHECK,
    port: process.env.DB_PORT
};

const db = new Sequelize(process.env.DB_NAME,dbConfig.user,dbConfig.pass,{
    host:dbConfig.host,
    dialect:"mysql",
    port:dbConfig.port,
    define:{
        timestamps:true
    },
    logging:false
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