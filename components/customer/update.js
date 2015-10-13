module.exports = function(data, transaction, models, components, cb){
  models.Customer.findOne({
    where: {
      status: 'active',
      id: data.id
    },
  })
  .then(function(customer) {
    if(customer) {
      return models.CustomerDetail.create({
        CustomerId: customer.id,
        firmname_1: data.firmname_1,
        firmname_2: data.firmname_2,
        firmname_3: data.firmname_3,
        address_1: data.address_1,
        address_2: data.address_2,
        address_3: data.address_3,
        nip: data.nip
      })
      .then(function() {
        cb(null, {success:true});
      });
    } else {
      cb(null, {success:false, error: {code:"MODEL_NOT_FOUND"}});
    }
  })
  .catch(function(err){
    cb(err);
  });
};