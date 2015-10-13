module.exports = function(data, transaction, models, components, cb){
  var _invoice;
  var _valueTaxRate = {};
  var _valueNet = 0;
  var _valueVat = 0;
  var _valueGross = 0;
  models.sequelize.transaction().then(function (t) {
    models.Invoice.create({
      CustomerDetailId: data.customer_id,
      invoice_city: data.invoice_city,
      invoice_date: data.invoice_date,
      sale_date: data.sale_date,
      payment_method: data.payment_method,
      invoice_number: data.invoice_number,
      actual_payment: data.actual_payment,
      currency: data.currency,
      payment_due: data.payment_due,
      value_net: 0,
      value_vat: 0,
      value_gross: 0,
      value_balance: 0
    }, {transaction : t})
    .then(function(invoice){
      _invoice = invoice;
      return models.sequelize.Promise.map(data.invoiceItemList, function(item) {
        var valueNet = item.quantity * item.price_net;
        var valueVat = valueNet * item.vat_rate / 100;
        var valueGross = valueNet + valueVat;
        if(_valueTaxRate[item.vat_rate] === undefined){//there is already this tax vat rate
          _valueTaxRate[item.vat_rate] = {
            vat_rate: item.vat_rate,
            value_net: 0,
            value_vat: 0,
            value_gross: 0
          };
        }
        _valueTaxRate[item.vat_rate].value_net += valueNet;
        _valueNet += valueNet;
        _valueTaxRate[item.vat_rate].value_vat += valueVat;
        _valueVat += valueVat;
        _valueTaxRate[item.vat_rate].value_gross += valueGross;
        _valueGross += valueGross;
        return models.InvoiceItem.create({
          InvoiceId: _invoice.id,
          name: item.name,
          quantity: item.quantity,
          unit: item.unit,
          price_net: item.price_net,
          vat_rate: item.vat_rate,
          value_net: valueNet,
          value_vat: valueVat,
          value_gross: valueGross
        }, {transaction : t});
      });
    })
    .then(function(){
      var valueTaxRate = [];
      for(var key in _valueTaxRate){
        if(_valueTaxRate.hasOwnProperty(key)){
          valueTaxRate.push(_valueTaxRate[key]);
        }
      }
      return models.sequelize.Promise.map(valueTaxRate, function(taxRate) {
        return   models.ValueTaxRate.create({
          InvoiceId: _invoice.id,
          vat_rate: taxRate.vat_rate,
          value_net: taxRate.value_net,
          value_vat: taxRate.value_vat,
          value_gross: taxRate.value_gross
        }, {transaction : t});
      });
    })
    .then(function(){
      _invoice.value_net = _valueNet;
      _invoice.value_vat = _valueVat;
      _invoice.value_gross = _valueGross;
      _invoice.value_balance = _valueGross - _invoice.actual_payment;
      return _invoice.save({transaction : t});
    })
    .then(function(){
      t.commit();
      cb(null, {success:true, id: _invoice.id});
    })
    .catch(function(err){
      t.rollback();
      cb(err);
    });
  });
};