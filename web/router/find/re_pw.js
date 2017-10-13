var express = require('express');
var app = express();
var router = express.Router();
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');

var connection = mysql.createConnection({
  host     : 'localhost',
  port     : 3306,
  user     : 'root',
  password : '111111',
  database : 'p1'
});

connection.connect();

router.get('/',function(req,res){
  res.render('find/re_pw',{'message':' '});
})

router.post('/', function(req,res){
  var id = req.body.id;
  var password = req.body.password;
  var repassword = req.body.repassword;

  if(password===repassword){
    var hash = bcrypt.hashSync(password);
    var sql = 'update member set password=? where id=?';
    connection.query(sql, [hash,id], function(err,rows){
      if(err){
        res.status(500).send('Something broke!');
        console.log(err);
      } else {
        res.redirect('/login');
      }
    });
} else {
  var sql = 'select * from member where id=?';
  connection.query(sql,id,function(err,rows){
    if(err){
      res.status(500).send('Something broke!');
      console.log(err.code);
    }
  res.render('find/re_pw.ejs',{'message':'비밀번호가 일치하지 않습니다.', rows:rows})
  })
 }
 })

module.exports = router;
