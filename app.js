var express = require('express');
var path = require('path');
var http = require('http');
var logger = require('morgan');
var bodyParser = require('body-parser');
var _routes = require('./routes/index');
var _app = express();
var _config, _models, _components, _server;
module.exports.init = function(config){
  _config = config;
  _app.use(logger('dev'));
  _app.use(bodyParser.json());
  _app.use(bodyParser.urlencoded({ extended: false }));
  _app.use(express.static(path.join(__dirname, 'public')));
  _app.set('port', process.env.PORT || _config.app.port);
  _models = require("./models")(_config.db);
  _components = require("./components")(_models);
  _app.set('models', _models);
  _app.set('config', _config);
  _app.set('components', _components);
  _app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Access-Token, Accept, Origin, X-Requested-With');
    next();
  });
  _app.use(_routes);
  // catch 404 and forward to error handler
  _app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
  /**
   * Sequelize validation error handler
   */
  _app.use(function(err, req, res, next){
    console.log(err);
    if(err.name === 'SequelizeValidationError'){
      res.status(422).json({
        error:{
          status: 422,
          details: err.errors.map(function(error){
            delete error.__raw;
            return error;
          })
        }
      });
    } else {
      next(err);
    }
  });
  /**
   * Custom validation error
   */
  _app.use(function(err, req, res, next){
    console.log(err);
    if(err.name === 'ValidationError'){
      res.status(422).json({
        error:{
          status: 422,
          details: err.errors
        }
      });
    } else {
      next(err);
    }
  });
  // error handlers
  // development error handler
  if (_app.get('env') === 'development') {
    _app.use(function(err, req, res, next) {
      console.error(err);
      console.error(err.stack);
      res.status(err.status || 500);
      res.json({'error': {
        message: err.message,
        error: err
      }});
    });
  }
  // production error handler
  _app.use(function(err, req, res, next) {
    console.error(err);
    console.error(err.stack);
    res.status(err.status || 500);
    res.json({'error': {
      message: err.message,
      error: {}
    }});
  });
  _server = http.createServer(_app);
  _server.on('error', function(error){
    console.error(error);
    throw error;
  });
};
module.exports.syncDb = function(cb){
  _models.sequelize.sync({force: _config.model.forceSync})
  .then(function () {
    cb();
  });
};
module.exports.run = function(cb){
  module.exports.syncDb(function(){
    _server.listen(_app.get('port'), function(){
      cb(_server);
    });
  });
};
module.exports.stop = function(cb){
  _server.close(function(){
    cb();
  });
};
module.exports.app = _app;
