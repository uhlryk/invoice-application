/*jslint node: true */
"use strict";
module.exports = function(sequelize, DataTypes) {
  var Customer = sequelize.define("Customer", {
    status: {type: DataTypes.ENUM('active', 'archive'), defaultValue:'active'},
  }, {
    paranoid: false,
    freezeTableName: true,
    classMethods: {
      associate: function(models) {
        Customer.hasMany(models.CustomerDetail);
      }
    }
  });
  return Customer;
};