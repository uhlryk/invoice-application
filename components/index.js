/*jslint node: true */
"use strict";
var fs = require("fs");
var path = require("path");
var _componentList, _modelList;
function findDirectory(sourceDirectory, componentObject){
  var directoryList = fs.readdirSync(sourceDirectory)
  .map(function(directory){
    return path.join(sourceDirectory, directory);
  });
  directoryList.forEach(function(directoryPath) {
    var stat = fs.statSync(directoryPath);
    if(stat.isFile()  && path.extname(directoryPath) === '.js' && path.basename(directoryPath) !== 'index.js'){
      componentObject[path.basename(directoryPath, '.js')] = prepareComponent(directoryPath);
    } else if(stat.isDirectory()){
      componentObject[path.basename(directoryPath)] = findDirectory(directoryPath, {});
    }
  });
  return componentObject;
}
function prepareComponent(componentPath){
  var _component = require('./' + path.relative(__dirname, componentPath));
  return function(data, options, cb){
    if(typeof data === 'function'){
      _component({}, {}, _modelList, _componentList, data);

    } else if(typeof options === 'function'){
      _component(data, {}, _modelList, _componentList, options);
    } else {
      _component(data, options, _modelList, _componentList, cb);
    }
  };
}
module.exports = function(modelList){
  _modelList = modelList;
  _componentList = {};
  findDirectory(__dirname, _componentList);
  return _componentList;
};