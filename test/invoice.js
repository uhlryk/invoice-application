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
var invoiceCreateData = {
  customer_id: 1,
  invoice_city: "Poznan",
  invoice_date: new Date(),
  sale_date: new Date(),
  payment_method: "przelew",
  invoice_number: "Faktura-112",
  actual_payment: 100,
  invoiceItemList: [
    {
      name: "produkt1",
      quantity: 10,
      unit: "szt",
      price_net: 100,
      vat_rate: 23
    }, {
      name: "produkt2",
      quantity: 15,
      unit: "szt",
      price_net: 200,
      vat_rate: 20
    }
  ],
  currency: "PLN",
  payment_due: 20
};
App.init(config);
describe("Invoice API", function() {
  describe("Empty model", function() {
    beforeEach(function (done) {
      App.syncDb(function(server){
        request(App.app).post('/customer')
        .send(customerCreateData)
        .end(function (err, res) {
          done();
        });
      });
    });
    it('should return status 200 with empty array when call customer list', function (done) {
      request(App.app).get('/invoice')
      .end(function (err, res) {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body).to.be.length(0);
        done();
      });
    });
    it('should return 404 status when call detail', function(done) {
      request(App.app).get('/invoice/1')
      .end(function (err, res) {
        expect(res.status).to.be.equal(404);
        expect(res.body.error.code).to.be.equal('MODEL_NOT_FOUND');
        done();
      });
    });
    it('should return 404 status when call update', function(done) {
      request(App.app).put('/invoice/1')
      .send(invoiceCreateData)
      .end(function (err, res) {
        expect(res.status).to.be.equal(404);
        expect(res.body.error.code).to.be.equal('INVOICE_NOT_EDITABLE');
        done();
      });
    });
    it('should return 404 status when call delete', function(done) {
      request(App.app).delete('/invoice/1')
      .send(invoiceCreateData)
      .end(function (err, res) {
        expect(res.status).to.be.equal(404);
        expect(res.body.error.code).to.be.equal('INVOICE_NOT_DELETABLE');
        done();
      });
    });
    it('should return 200 status and created model  when call create', function(done) {
      request(App.app).post('/invoice')
      .send(invoiceCreateData)
      .end(function (err, res) {
        expect(res.status).to.be.equal(200);
        expect(res.body.id).to.be.equal(1);
        done();
      });
    });
  });
  describe("Model with elements", function() {
    var elementId;
    beforeEach(function (done) {
      App.syncDb(function(server){
        request(App.app).post('/customer')
        .send(customerCreateData)
        .end(function (err, res) {
        request(App.app).post('/invoice')
          .send(invoiceCreateData)
          .end(function (err, res) {
            elementId = res.body.id;
            done();
          });
        });
      });
    });
    it('should return success flag and list of models when call list', function(done) {
      request(App.app).get('/invoice')
      .end(function (err, res) {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.length(1);
        expect(res.body[0].id).to.be.equal(1);
        done();
      });
    });
    it('should return success flag and model when call detail', function(done) {
      request(App.app).get('/invoice/'+elementId)
      .end(function (err, res) {
        expect(res.status).to.be.equal(200);
        expect(res.body.id).to.be.equal(1);
        done();
      });
    });
    it('should return success flag  when multiple calls create', function(done) {
      request(App.app).post('/invoice')
      .send(invoiceCreateData)
      .end(function (err, res) {
        expect(res.status).to.be.equal(200);
        expect(res.body.id).to.be.equal(2);
        done();
      });
    });
    it('should return success flag and model when call pdf', function(done) {
      request(App.app).get('/invoice/'+elementId+"/pdf")
      .end(function (err, res) {
        expect(res.status).to.be.equal(200);
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