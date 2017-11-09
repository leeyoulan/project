var express = require('express');
var app = express();
var router = express.Router();

router.get('/',function(req,res){
    res.render('main/main.ejs',{'userId':req.user});
  })


module.exports = router;
