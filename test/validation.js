/**
 * Because app has only one user, no public api, there is only basic validation
 */
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
  payment_due: '20'
};
App.init(config);
describe("Validation", function() {
  describe("Customer", function() {
    beforeEach(function (done) {
      App.syncDb(function(server){
        done();
      });
    });
    it('should return 422 status and error model when send to long data', function(done) {
      request(App.app).post('/customer')
      .send({
        firmname_1: "tkjnsdkjvsdkdsvnvdsknjdvvdk sdknvdsjvdkj;vdnj;ks sdkvdsn;dksvjn",
        address_1: "11-111 City, Street 1",
        nip: "1234566778",
      })
      .end(function (err, res) {
        expect(res.status).to.be.equal(422);
        expect(res.body.error.status).to.be.equal(422);
        expect(res.body.error.details).to.be.an('array');
        expect(res.body.error.details).to.be.length(1);
        expect(res.body.error.details).to.include.some.property('message','Validation len failed');
        done();
      });
    });
    it('should return 422 status and error model when send data with empty required field', function(done) {
      request(App.app).post('/customer')
      .send({
        firmname_1: "test",
        address_1: "11-111 City, Street 1",
      })
      .end(function (err, res) {
        expect(res.status).to.be.equal(422);
        expect(res.body.error.status).to.be.equal(422);
        expect(res.body.error.details).to.be.an('array');
        expect(res.body.error.details).to.be.length(1);
        expect(res.body.error.details).to.include.some.property('message','nip cannot be null');
        done();
      });
    });
  });
  describe("Invoice", function() {
    beforeEach(function (done) {
      App.syncDb(function(server){
        request(App.app).post('/customer')
        .send(customerCreateData)
        .end(function (err, res) {
          done();
        });
      });
    });
    it('should return 422 status and error model  when call create with no date invoice_date', function(done) {
      var invoiceCreateData2 = JSON.parse(JSON.stringify(invoiceCreateData));
      invoiceCreateData2.invoice_date = "notDate";
      request(App.app).post('/invoice')
      .send(invoiceCreateData2)
      .end(function (err, res) {
        expect(res.status).to.be.equal(422);
        expect(res.body.error.details).to.be.an('array');
        expect(res.body.error.details).to.be.length(1);
        expect(res.body.error.details).to.include.some.property('message','Validation isDate failed');
        done();
      });
    });
    it('should return 200 status when call create with actual_payment below 0', function(done) {
      var invoiceCreateData2 = JSON.parse(JSON.stringify(invoiceCreateData));
      invoiceCreateData2.actual_payment = -100;
      request(App.app).post('/invoice')
      .send(invoiceCreateData2)
      .end(function (err, res) {
        expect(res.status).to.be.equal(200);
        expect(res.body.id).to.be.equal(1);
        done();
      });
    });
    it('should return 422 status and error model  when call create with invoice item object with below 0 quantity', function(done) {
      var invoiceCreateData2 = JSON.parse(JSON.stringify(invoiceCreateData));
      invoiceCreateData2.invoiceItemList[0].quantity = - 1;
      request(App.app).post('/invoice')
      .send(invoiceCreateData2)
      .end(function (err, res) {
        expect(res.status).to.be.equal(422);
        expect(res.body.error.details).to.be.an('array');
        expect(res.body.error.details).to.be.length(1);
        expect(res.body.error.details).to.include.some.property('message','Validation number or range failed');
        done();
      });
    });
    it('should return 422 status and error model  when call create with invoice item object with float quantity', function(done) {
      var invoiceCreateData2 = JSON.parse(JSON.stringify(invoiceCreateData));
      invoiceCreateData2.invoiceItemList[0].quantity = 1.1234;
      request(App.app).post('/invoice')
      .send(invoiceCreateData2)
      .end(function (err, res) {
        expect(res.status).to.be.equal(422);
        expect(res.body.error.details).to.be.an('array');
        expect(res.body.error.details).to.be.length(1);
        expect(res.body.error.details).to.include.some.property('message','Validation number or range failed');
        done();
      });
    });
    it('should return 422 status and error model  when call create with invoice item object with below 0 price_net', function(done) {
      var invoiceCreateData2 = JSON.parse(JSON.stringify(invoiceCreateData));
      invoiceCreateData2.invoiceItemList[0].price_net = -1;
      request(App.app).post('/invoice')
      .send(invoiceCreateData2)
      .end(function (err, res) {
        expect(res.status).to.be.equal(422);
        expect(res.body.error.details).to.be.an('array');
        expect(res.body.error.details).to.be.length(1);
        expect(res.body.error.details).to.include.some.property('message','Validation number or range failed');
        done();
      });
    });
    it('should return 422 status and error model  when call create with invoice item object with to big price_net', function(done) {
      var invoiceCreateData2 = JSON.parse(JSON.stringify(invoiceCreateData));
      invoiceCreateData2.invoiceItemList[0].price_net = 199999999;
      request(App.app).post('/invoice')
      .send(invoiceCreateData2)
      .end(function (err, res) {
        expect(res.status).to.be.equal(422);
        expect(res.body.error.details).to.be.an('array');
        expect(res.body.error.details).to.be.length(1);
        expect(res.body.error.details).to.include.some.property('message','Validation number or range failed');
        done();
      });
    });
    it('should return 422 status and error model  when call create with invoice item object with below 0 vat_rate', function(done) {
      var invoiceCreateData2 = JSON.parse(JSON.stringify(invoiceCreateData));
      invoiceCreateData2.invoiceItemList[0].vat_rate = -1;
      request(App.app).post('/invoice')
      .send(invoiceCreateData2)
      .end(function (err, res) {
        expect(res.status).to.be.equal(422);
        expect(res.body.error.details).to.be.an('array');
        expect(res.body.error.details).to.be.length(1);
        expect(res.body.error.details).to.include.some.property('message','Validation number or range failed');
        done();
      });
    });
    it('should return 422 status and error model  when call create with invoice item object with above 100 vat_rate', function(done) {
      var invoiceCreateData2 = JSON.parse(JSON.stringify(invoiceCreateData));
      invoiceCreateData2.invoiceItemList[0].vat_rate = 111;
      request(App.app).post('/invoice')
      .send(invoiceCreateData2)
      .end(function (err, res) {
        expect(res.status).to.be.equal(422);
        expect(res.body.error.details).to.be.an('array');
        expect(res.body.error.details).to.be.length(1);
        expect(res.body.error.details).to.include.some.property('message','Validation number or range failed');
        done();
      });
    });
    it('should return 422 status and error model  when call create with invoice item object with float vat_rate', function(done) {
      var invoiceCreateData2 = JSON.parse(JSON.stringify(invoiceCreateData));
      invoiceCreateData2.invoiceItemList[0].vat_rate = 1.11;
      request(App.app).post('/invoice')
      .send(invoiceCreateData2)
      .end(function (err, res) {
        expect(res.status).to.be.equal(422);
        expect(res.body.error.details).to.be.an('array');
        expect(res.body.error.details).to.be.length(1);
        expect(res.body.error.details).to.include.some.property('message','Validation number or range failed');
        done();
      });
    });
  });
});