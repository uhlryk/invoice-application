/*jslint node: true */
"use strict";
module.exports = function(sequelize, DataTypes) {
  var CustomerDetail = sequelize.define("CustomerDetail", {
    firmname_1: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate : {
        len: [1,50]
      }
    },
    firmname_2: {
      type: DataTypes.STRING(50),
      allowNull: true,
      validate : {
        len: [0,50]
      }
    },
    firmname_3: {
      type: DataTypes.STRING(50),
      allowNull: true,
      validate : {
        len: [0,50]
      }
    },
    address_1: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate : {
        len: [1,50]
      }
    },
    address_2: {
      type: DataTypes.STRING(50),
      allowNull: true,
      validate : {
        len: [0,50]
      }
    },
    address_3: {
      type: DataTypes.STRING(50),
      allowNull: true,
      validate : {
        len: [0,50]
      }
    },
    nip: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate : {
        len: [1,20]
      }
    }
  }, {
    paranoid: false,
    freezeTableName: true,
    classMethods: {
      associate: function(models) {
        CustomerDetail.hasMany(models.Invoice);
        CustomerDetail.belongsTo(models.Customer);
      }
    }
  });
  return CustomerDetail;
};