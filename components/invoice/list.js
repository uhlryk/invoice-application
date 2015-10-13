module.exports = function(data, transaction, models, components, cb){
  models.Invoice.findAll({
    where: {
    },
    attributes: ['id', 'CustomerDetailId', 'invoice_city', 'invoice_date', 'sale_date', 'payment_method',
    'invoice_number', 'value_net', 'value_vat', 'value_gross', 'actual_payment',
    'value_balance', 'currency', 'payment_due'],
    include: [{
      model: models.CustomerDetail,
      attributes: ['id','firmname_1', 'nip'],
    }],
    order: [['id','desc']]
  })
  .then(function(invoices) {
    cb(null, {success:true, invoiceList: invoices.map(
      function(invoice){
        return invoice.toJSON();
      })
    });
  })
  .catch(function(err){
    cb(err);
  });
};