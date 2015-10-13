/**
 * API for invoice
 */

var express = require('express');
var router = express.Router();
var validator = require('validator');

function checkValidation(req, res, next){
  var invoiceItemList = req.body.invoiceItemList;
  var errorsList = [];
  if(validator.isFloat(req.body.actual_payment, { min: -99999999, max: 99999999 }) === false){
    errorsList.push({path:'actual_payment', type:'Number Validation', message:'Validation number or range failed'});
  } else {
    req.body.actual_payment = Math.round(req.body.actual_payment * 100) / 100;
  }
  if(invoiceItemList && invoiceItemList.length){
    for(var i = 0; i < invoiceItemList.length; i++){
      var item = invoiceItemList[i];
      if(validator.isInt(item.quantity) === false || item.quantity < 0 || item.quantity> 99999999){
        // item.quantity = validator.toInt(item.quantity,10);
        errorsList.push({path:['invoiceItemList',i,'quantity'], type:'Int Validation', message:'Validation number or range failed'});
      }
      if(validator.isFloat(item.price_net, { min: 0, max: 99999999 }) === false){
        // item.price_net = validator.toFloat(item.price_net);
        errorsList.push({path:['invoiceItemList',i,'price_net'], type:'Number Validation', message:'Validation number or range failed'});
      } else {
        invoiceItemList[i].price_net = Math.round(item.price_net * 100) / 100;
      }
      if(validator.isInt(item.vat_rate) === false || item.vat_rate < 0 || item.vat_rate> 100){
        // item.vat_rate = validator.toInt(item.vat_rate,10);
        errorsList.push({path:['invoiceItemList',i,'vat_rate'], type:'Int Validation', message:'Validation number or range failed'});
      }
    }
  } else {
    errorsList.push({path:'invoiceItemList',type:'Array Validation', message:'Array is required'});
  }
  if(errorsList.length){
    next({errors: errorsList, name:"ValidationError"});
  } else{
    next();
  }
}

router.get('/invoice', function(req, res, next) {
  req.app.get('components').invoice.list(function(err, data){
    if(err){
      next(err);
    } else {
      return res.status(200).json(data.invoiceList);
    }
  });
});
router.get('/invoice/:id', function(req, res, next) {
  req.app.get('components').invoice.detail({id:req.params.id}, function(err, data){
    if(err){
      next(err);
    } else {
      if(data.success === true){
        return res.status(200).json(data.invoice);
      } else {
        return res.status(404).json({error:data.error});
      }
    }
  });
});
router.get('/invoice/:id/pdf', function(req, res, next) {
  req.app.get('components').invoice.generate({id:req.params.id, account: req.app.get('config').account}, function(err, data){
    if(err){
      next(err);
    } else {
      if(data.success === true){
        return res.status(200).download(data.invoicePath);
      } else {
        return res.status(404).json({error:data.error});
      }
    }
  });
});
router.post('/invoice', checkValidation, function(req, res, next) {
  new Promise(function(resolve) {
    req.app.get('components').invoice.create({
      customer_id: req.body.customer_id,
      invoice_city: req.body.invoice_city,
      invoice_date: req.body.invoice_date,
      sale_date: req.body.sale_date,
      payment_method: req.body.payment_method,
      invoice_number: req.body.invoice_number,
      actual_payment: req.body.actual_payment,
      invoiceItemList: req.body.invoiceItemList,
      currency: req.body.currency,
      payment_due: req.body.payment_due
    }, function(err, data){
      if(err){
        next(err);
      } else {
        resolve(data.id);
      }
    });
  })
  .then(function(invoiceId){
    req.app.get('components').invoice.detail({id:invoiceId}, function(err, data){
      if(err){
        next(err);
      } else {
        if(data.success === true){
          return res.status(200).json(data.invoice);
        } else {
          return res.status(404).json({error:data.error});
        }
      }
    });
  })
  .catch(function(err){
    return next(err);
  });
});
router.put('/invoice/:id', function(req, res, next) {
  return res.status(404).json({error:{code:"INVOICE_NOT_EDITABLE"}});
});
router.delete('/invoice/:id', function(req, res, next) {
  return res.status(404).json({error:{code:"INVOICE_NOT_DELETABLE"}});
});

module.exports = router;