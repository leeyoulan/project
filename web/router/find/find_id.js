var express = require('express');
var app = express();
var router = express.Router();
var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  port     : 3306,
  user     : 'root',
  password : '111111',
  database : 'p1'
});

connection.connect();

router.get('/',function(req,res){
  res.render('find/find_id.ejs',{'message':' '});
})

router.post('/', function(req,res){
  var name = req.body.name;
  var email = req.body.email;

  var sql = 'select id from member where name=? and email=?';

  connection.query(sql,[name, email],function(err,rows){
    if(err){
      res.status(500).send('Something broke!');
      console.log(err.code);
    }
    if(rows.length!=0){
      res.render('find/result_id',{rows:rows});
    }
    else{
      res.render('find/find_id.ejs',{'message':'일치하는 정보가 없습니다.'})
    }
  });
});


module.exports = router;
