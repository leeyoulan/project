var express = require('express');
var app = express();
var router = express.Router();

router.get('/',function(req,res){
    req.logout();
    res.redirect('/main');
  })

module.exports = router;
