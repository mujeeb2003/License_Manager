const { DataTypes } = require('sequelize');
const db = require('../config/databaseConfig.js');

const DomainVendor = db.define('DomainVendor', {
    domain_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'domains',
            key: 'domain_id'
        }
    },
    vendor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'vendors',
            key: 'vendor_id'
        }
    }
}, {
    tableName: 'vendor_domains',
    timestamps: true
});

module.exports = DomainVendor;