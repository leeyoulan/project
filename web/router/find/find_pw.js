var express = require('express');
var app = express();
var router = express.Router();
var mysql = require('mysql');
var dbconfig = require('./dbconfig.json');

var connection = mysql.createConnection({
  host     : dbconfig.host,
  port     : dbconfig.port,
  user     : dbconfig.user,
  password : dbconfig.password,
  database : dbconfig.database
});
connection.connect();

router.get('/',function(req,res){
  res.render('find/find_pw',{'message':' '});
})

router.post('/', function(req,res){
  var id = req.body.id;
  var name = req.body.name;
  var email = req.body.email;

  var sql = 'select * from member where id=? and name=? and email=?';

  connection.query(sql,[id,name,email],function(err,rows){
    if(err){
      res.status(500).send('Something broke!');
      console.log(err.code);
    }
    if(rows.length!=0){
      res.render('find/re_pw.ejs',{rows:rows,'message':' '});
    }
    else{
      res.render('find/find_pw.ejs',{'message':'일치하는 정보가 없습니다.'})
    }
  });
});


module.exports = router;
