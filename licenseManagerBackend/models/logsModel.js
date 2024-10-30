const { DataTypes } = require('sequelize');
const db = require('../config/databaseConfig.js');

const Log = db.define('Log', {
  log_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
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
  license_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  action_type: {
    type: DataTypes.STRING,
    allowNull: false,  // e.g., CREATE, UPDATE, DELETE, EXPIRE
  }
}, {
  tableName: 'logs',
  timestamps: true  // Automatically adds createdAt and updatedAt columns
});

module.exports = Log;
