/*jslint node: true */
"use strict";
module.exports = function(config){
  var debug = require('debug')('db');
  var fs = require("fs");
  var path = require("path");
  var Sequelize = require("sequelize");
  var sequelize = new Sequelize(config.dbname, config.user, config.pass, {
    dialect : config.type,
    port : config.port,
    logging: function(log){
      debug(log);
    }
  });
  var db = {};
  fs.readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf(".") !== 0) && (file !== "index.js");
  })
  .forEach(function(file) {
    var model = sequelize["import"](path.join(__dirname, file));
    db[model.name] = model;
  });
  Object.keys(db).forEach(function(modelName) {
    if ("associate" in db[modelName]) {
      db[modelName].associate(db);
    }
  });
  db.sequelize = sequelize;
  db.Sequelize = Sequelize;
  return db;
};