var express = require('express');
var path = require('path');
var router = express.Router();
router.get('/customer', function(req, res, next) {
  req.app.get('components').customer.list(function(err, data){
    if(err){
      next(err);
    } else {
      return res.status(200).json(data.customerList);
    }
  });
});
router.get('/customer/:id', function(req, res, next) {
  req.app.get('components').customer.detail({id:req.params.id}, function(err, data){
    if(err){
      next(err);
    } else {
      if(data.success === true){
        return res.status(200).json(data.customer);
      } else {
        return res.status(404).json({error:data.error});
      }
    }
  });
});
router.post('/customer', function(req, res, next) {
  new Promise(function(resolve) {
    req.app.get('components').customer.create({
      firmname_1: req.body.firmname_1,
      firmname_2: req.body.firmname_2,
      firmname_3: req.body.firmname_3,
      address_1: req.body.address_1,
      address_2: req.body.address_2,
      address_3: req.body.address_3,
      nip: req.body.nip
    }, function(err, data){
      if(err){
        next(err);
      } else {
        resolve(data.id);
      }
    });
  })
  .then(function(customerId){
    req.app.get('components').customer.detail({id:customerId}, function(err, data){
      if(err){
        next(err);
      } else {
        if(data.success === true){
          return res.status(200).json(data.customer);
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
router.put('/customer/:id', function(req, res, next) {
  req.app.get('components').customer.update({
    id:req.params.id,
    firmname_1: req.body.firmname_1,
    firmname_2: req.body.firmname_2,
    firmname_3: req.body.firmname_3,
    address_1: req.body.address_1,
    address_2: req.body.address_2,
    address_3: req.body.address_3,
    nip: req.body.nip
  }, function(err, data){
    if(err){
      next(err);
    } else {
      if(data.success === true){
        return res.status(200).end();
      } else {
        return res.status(404).json({error:data.error});
      }
    }
  });
});
router.delete('/customer/:id', function(req, res, next) {
  req.app.get('components').customer.delete({
    id:req.params.id
  }, function(err, data){
    if(err){
      next(err);
    } else {
      if(data.success === true){
        return res.status(204).end();
      } else {
        return res.status(404).json({error:data.error});
      }
    }
  });
});
module.exports = router;