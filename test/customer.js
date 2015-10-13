var chai = require("chai");
chai.use(require('chai-things'));
var expect = chai.expect;
var config = require('../config/config');
var request = require('supertest');
var App = require('../app');
var customerCreateData = {
  firmname_1: "Test Firm",
  address_1: "11-111 City, Street 1",
  nip: "1234566778",
};
var customerUpdateData = {
  firmname_1: "Test Firm A",
  address_1: "11-111 City, Street 2",
  nip: "3456474564",
};
App.init(config);
describe("Customer API", function() {
  describe("Empty model", function() {
    beforeEach(function (done) {
      App.syncDb(function(server){
        done();
      });
    });
    it('should return success flag with empty model list when call list', function (done) {
      request(App.app).get('/customer')
      .end(function (err, res) {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body).to.be.length(0);
        done();
      });
    });
    it('should return failed flag when call detail', function(done) {
      request(App.app).get('/customer/1')
      .end(function (err, res) {
        expect(res.status).to.be.equal(404);
        expect(res.body.error.code).to.be.equal('MODEL_NOT_FOUND');
        done();
      });
    });
    it('should return failed flag when call update', function(done) {
      request(App.app).put('/customer/1')
      .send(customerUpdateData)
      .end(function (err, res) {
        expect(res.status).to.be.equal(404);
        expect(res.body.error.code).to.be.equal('MODEL_NOT_FOUND');
        done();
      });
    });
    it('should return failed flag when call delete', function(done) {
      request(App.app).delete('/customer/1')
      .end(function (err, res) {
        expect(res.status).to.be.equal(404);
        expect(res.body.error.code).to.be.equal('MODEL_NOT_FOUND');
        done();
      });
    });
    it('should return success flag and created model id  when call create', function(done) {
      request(App.app).post('/customer')
      .send(customerCreateData)
      .end(function (err, res) {
        expect(res.status).to.be.equal(200);
        expect(res.body.id).to.be.equal(1);
        done();
      });
    });
    afterEach(function(done) {
      App.stop(function(){
        done();
      });
    });
  });
  describe("Model with elements", function() {
    var elementId;
    beforeEach(function (done) {
      App.syncDb(function(server){
        request(App.app).post('/customer').send(customerCreateData).end(function (err, res) {
          elementId = res.body.id;
          done();
        });
      });
    });
    it('should return success flag and list of models when call list', function(done) {
      request(App.app).get('/customer')
      .end(function (err, res) {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.length(1);
        expect(res.body[0].id).to.be.equal(1);
        done();
      });
    });
    it('should return success flag and model when call detail', function(done) {
      request(App.app).get('/customer/'+elementId)
      .end(function (err, res) {
        expect(res.status).to.be.equal(200);
        expect(res.body.id).to.be.equal(1);
        done();
      });
    });
    it('should return failed flag when call update', function(done) {
      request(App.app).put('/customer/'+elementId)
      .send(customerUpdateData)
      .end(function (err, res) {
        expect(res.status).to.be.equal(200);
        done();
      });
    });
    it('should return failed flag when call delete', function(done) {
      request(App.app).delete('/customer/'+elementId)
      .end(function (err, res) {
        expect(res.status).to.be.equal(204);
        done();
      });
    });
    it('should return success flag  when multiple calls create', function(done) {
      request(App.app).post('/customer')
      .send(customerCreateData)
      .end(function (err, res) {
        expect(res.status).to.be.equal(200);
        expect(res.body.id).to.be.equal(2);
        done();
      });
    });
    afterEach(function(done) {
      App.stop(function(){
        done();
      });
    });
  });
});