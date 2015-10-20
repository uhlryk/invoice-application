/*jslint node: true */
"use strict";
module.exports = function(sequelize, DataTypes) {
  var InvoiceItem = sequelize.define("InvoiceItem", {
    name: {
      type: DataTypes.STRING(120),
      allowNull: false,
      validate : {
        len: [1,120]
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate : {
        min: 0,
        max: 99999999
      }
    },
    unit: {
      type: DataTypes.STRING(5),
      allowNull: false,
      validate : {
        len: [1,5]
      }
    },
    price_net: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      validate : {
        min: 0,
        max: 99999999
      }
    },
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
        min: 0,
        max: 99999999
      }
    },
    value_gross: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      validate : {
        min: 0,
        max: 99999999
      }
    },
  }, {
    paranoid: false,
    freezeTableName: true,
    classMethods: {
      associate: function(models) {
        InvoiceItem.belongsTo(models.Invoice);
      }
    }
  });
  return InvoiceItem;
};