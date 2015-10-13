module.exports = function(data, transaction, models, components, cb){
  models.Customer.findAll({
    where: {
      status: 'active'
    },
    attributes: ['id'],
    include: [{
      model : models.CustomerDetail,
      limit:1,
      attributes: ['id', 'CustomerId', 'firmname_1', 'nip'],
      order: [['id','desc']]
    }],
    order: [['id','desc']]
  })
  .then(function(customers) {
    cb(null, {success:true, customerList: customers.map(
      function(customer){
        customer = customer.toJSON();
        var customerDetail = customer.CustomerDetails[0];
        for(var key in customerDetail){
          if(customerDetail.hasOwnProperty(key) && key !== 'id'){
            customer[key] = customerDetail[key];
          }
        }
        delete customer.CustomerDetails;
        return customer;
      })
    });
  })
  .catch(function(err){
    cb(err);
  });
};