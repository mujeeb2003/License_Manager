const { DataTypes } = require('sequelize');
const db = require('../config/databaseConfig.js');

const Manager = db.define('Manager', {
    manager_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    project: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    tableName: 'managers'
});

module.exports = Manager;
