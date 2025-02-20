const { DataTypes } = require('sequelize');
const db = require('../config/databaseConfig.js');

const Domain = db.define('Domain', {
    domain_id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    domain_name:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    parent_domain_id:{
        type: DataTypes.INTEGER,
        allowNull: true,
        references:{
            model: 'domains',
            key: 'domain_id'
        }
    }
}, {
    tableName: 'domains'
});

module.exports = Domain;
