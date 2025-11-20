// models/Diary.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db/index');

const Diary = sequelize.define('Diary', {
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    unique: true
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'diaries',
  timestamps: true
});

module.exports = Diary;
