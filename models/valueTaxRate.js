/*jslint node: true */
"use strict";
module.exports = function(sequelize, DataTypes) {
  var ValueTaxRate = sequelize.define("ValueTaxRate", {
    vat_rate: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate : {
        min: 0,
        max: 100
      }
    },
    value_net: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      validate : {
        min: 0,
        max: 99999999
      }
    },
    value_vat: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      validate : {
        min: 1,
        max: 99999999
      }
    },
    value_gross: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      validate : {
        min: 1,
        max: 99999999
      }
    },
  }, {
    paranoid: false,
    freezeTableName: true,
    classMethods: {
      associate: function(models) {
        ValueTaxRate.belongsTo(models.Invoice);
      }
    }
  });
  return ValueTaxRate;
};