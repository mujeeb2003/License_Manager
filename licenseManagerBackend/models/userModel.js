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
    },
    isSuperAdmin : {
        type: DataTypes.BOOLEAN,
        defaultValue:false
    },
    isDisable : {
        type: DataTypes.BOOLEAN,
        defaultValue:false
    },
    domain_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        references: {
            model: 'domains',
            key: 'domain_id'
        }
    }
}, {
    tableName: 'users'
});

module.exports = User;
