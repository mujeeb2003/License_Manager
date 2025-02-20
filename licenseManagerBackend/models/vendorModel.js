const { DataTypes } = require('sequelize');
const db = require('../config/databaseConfig.js');

const Vendor = db.define('Vendor', {
    vendor_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    vendor_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique:true
    },
    vendor_email:{
        type:DataTypes.STRING,
        allowNull:false
    },
    vendor_representative:{
        type:DataTypes.STRING,
        allowNull:false
    },
    vendor_rep_phone:{
        type:DataTypes.STRING,
        allowNull:false
    },
    vendor_rep_email:{
        type:DataTypes.STRING,
        allowNull:false
    }
}, {
    tableName: 'vendors'
});

module.exports = Vendor;

