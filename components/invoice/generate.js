var jadepdf = require('jade-pdf-redline');
var fs = require("fs");
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
        var outputStream = fs.createWriteStream(invoicePath);
        var inputStream = fs.createReadStream('./template/standard/invoice.jade')
        .pipe(jadepdf({
          // cssPath: './template/standard/style.css',
          locals: {
            invoice:invoiceData.invoice
          }
        }))
        .pipe(outputStream);
        outputStream.on('finish', function() {
          cb(null,{success:true, invoicePath:invoicePath});
        });
        inputStream.on('error', function(error) {
          cb(error);
        });
        outputStream.on('error', function(error) {
          cb(error);
        });
      } else {
        cb(null,{success:invoiceData.success,error:invoiceData.error});
      }
    }
  });
};