module.exports = function(data, options, models, components, cb){
  models.Customer.findOne({
    where: {
      status: 'active',
      id: data.id
    },
    attributes: ['id'],
    include: [{
      model : models.CustomerDetail,
      limit:1,
      attributes: ['id', 'CustomerId', 'firmname_1', 'firmname_2', 'firmname_3', 'address_1', 'address_2', 'address_3', 'nip'],
      order: [['id','desc']]
    }],
  })
  .then(function(customer) {
    if(customer){
      customer = customer.toJSON();
      var customerDetail = customer.CustomerDetails[0];
      for(var key in customerDetail){
        if(customerDetail.hasOwnProperty(key) && key !== 'id'){
          customer[key] = customerDetail[key];
        }
      }
      delete customer.CustomerDetails;
      cb(null, {success:true, customer: customer});
    } else {
      cb(null, {success:false, error: {code:"MODEL_NOT_FOUND"}});
    }
  })
  .catch(function(err){
    cb(err);
  });
};