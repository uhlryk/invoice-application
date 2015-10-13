module.exports = function(data, options, models, components, cb){
  models.Customer.findOne({
    where: {
      status: 'active',
      id: data.id
    },
    attributes: ['id','status']
  })
  .then(function(customer) {
    if(customer) {
      customer.status = 'archive';
      customer.save()
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