const { DataTypes } = require('sequelize');
const db = require('../config/databaseConfig.js');

const User = db.define('User', {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isAdmin : {
        type: DataTypes.BOOLEAN,
        defaultValue:false
    }
}, {
    tableName: 'users'
});

module.exports = User;
