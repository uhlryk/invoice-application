// var jadepdf = require('jade-pdf-redline');
var jade = require('jade');
var fs = require("fs");
var conversion = require("phantom-html-to-pdf")();
module.exports = function(data, options, models, components, cb){
  components.invoice.detail({id:data.id}, function(err, invoiceData){
    if(err){
      cb(err);
    } else {
      if(invoiceData.success === true){
        var invoicePath = './pdf/'+invoiceData.invoice.id + '.pdf';
        invoiceData.invoice.Account = data.account;
        invoiceData.invoice.invoice_date = new Date(invoiceData.invoice.invoice_date).toISOString().substr(0, 10);
        invoiceData.invoice.sale_date = new Date(invoiceData.invoice.sale_date).toISOString().substr(0, 10);
        jade.renderFile('./template/standard/invoice.jade', invoiceData, function(error, html){
          if(error){
            cb(error);
          } else {
            conversion({ html: html }, function(err, pdf) {
              cb(null,pdf.stream);
            });
          }
        });
      }
    }
  });
};