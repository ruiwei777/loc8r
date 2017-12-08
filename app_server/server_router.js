var express = require('express');


var router = express.Router();
var ctrls = require('./controllers');

router.get(/.*/, ctrls.index);

module.exports = router;
