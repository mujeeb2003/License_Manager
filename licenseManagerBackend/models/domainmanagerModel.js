const { DataTypes } = require('sequelize');
const db = require('../config/databaseConfig.js');

const DomainManager = db.define('DomainManager', {
    domain_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'domains',
            key: 'domain_id'
        }
    },
    manager_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'managers',
            key: 'manager_id'
        }
    }
}, {
    tableName: 'manager_domains',
    timestamps: true
});

module.exports = DomainManager;