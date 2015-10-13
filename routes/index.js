var express = require('express');
var router = express.Router();
var customer = require("./customer");
var invoice = require("./invoice");
router.use(customer);
router.use(invoice);
module.exports = router;