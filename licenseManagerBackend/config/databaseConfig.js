const {Sequelize} = require("sequelize");

const dbConfig = {
    host: "localhost",
    user:"root",
    pass:"",
    port:3306
};

const db = new Sequelize("lic_man",dbConfig.user,dbConfig.pass,{
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
        // await db.sync({ alter: true }); // { force: true } if you want to drop existing tables
        // console.log('Database synchronized successfully.');
    } catch (error) {
        console.error('Error synchronizing the database:', error);
    }
})();

module.exports = db;