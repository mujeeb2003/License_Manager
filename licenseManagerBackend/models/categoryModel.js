const { DataTypes } = require('sequelize');
const db = require('../config/databaseConfig.js');

const Category = db.define('Category', {
    category_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    category_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique:true
        
    }
}, {
    tableName: 'categories'
});

module.exports = Category;
