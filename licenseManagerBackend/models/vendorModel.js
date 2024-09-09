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
        
    }
}, {
    tableName: 'vendors'
});

module.exports = Vendor;
