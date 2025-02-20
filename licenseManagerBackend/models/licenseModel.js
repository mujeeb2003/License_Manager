const { DataTypes } = require('sequelize');
const db = require('../config/databaseConfig.js');

const License = db.define('License', {
    license_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    title:{
        type:DataTypes.STRING,
        allowNull: false
    },
    expiry_date:{
        type:DataTypes.DATE,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'user_id'
        },
    },
    vendor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'vendors',
            key: 'vendor_id'
        },
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'categories',
            key: 'category_id'
        },
    },
    manager_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'managers',
            key: 'manager_id'
        }
    },
    status_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'status',
            key: 'status_id'
        },
    },
    domain_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'domains',
            key: 'domain_id'
        }
    }
}, {
    tableName: 'licenses'
});

module.exports = License;
