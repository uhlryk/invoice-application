/*jslint node: true */
"use strict";
module.exports = function(sequelize, DataTypes) {
  var Invoice = sequelize.define("Invoice", {
    invoice_city: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate : {
        len: [1,20]
      }
    },
    invoice_date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate : {
        isDate: true,
      }
    },
    sale_date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate : {
        isDate: true,
      }
    },
    payment_method: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate : {
        len: [1,20]
      }
    },
    invoice_number: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate : {
        len: [1,20]
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
    actual_payment: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      validate : {
        min: -99999999,
        max: 99999999
      }
    },
    value_balance: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      validate : {
        min: -99999999,
        max: 99999999
      }
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      validate : {
        len: [0,3]
      }
    },
    payment_due: {
      type: DataTypes.STRING(10),
      allowNull: false,
      validate : {
        len: [1,10]
      }
    },
  }, {
    paranoid: false,
    freezeTableName: true,
    classMethods: {
      associate: function(models) {
        Invoice.hasMany(models.InvoiceItem);
        Invoice.hasMany(models.ValueTaxRate);
        Invoice.belongsTo(models.CustomerDetail);
      }
    }
  });
  return Invoice;
};