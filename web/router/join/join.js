var express = require('express');
var app = express();
var router = express.Router();
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
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
  res.render('join/join.ejs',{'message' : ' '});
})

router.post('/',function(req,res) {
  var id = req.body.id;
  var password = req.body.password;
  var repassword = req.body.repassword;
  var name = req.body.name;
  var email = req.body.email;


  var sql = 'select * from member where id=?';
  connection.query(sql,[id],function(err,rows){
    if (err) {
      res.status(500).send('Something broke!');
      console.log(err.code);
    }

    else if(id==''){
      res.render('join/join.ejs', {'message' : '아이디를 입력해주세요.'})
    }

    else if(password==''){
      res.render('join/join.ejs', {'message' : '비밀번호를 입력해주세요.'})
    }

    else if(repassword==''){
      res.render('join/join.ejs', {'message' : '비밀번호를 재입력해주세요.'})
    }

    else if(password!==repassword){
      res.render('join/join.ejs', {'message' : '비밀번호가 일치하지 않습니다.'})
    }

    else if(name==''){
      res.render('join/join.ejs', {'message' : '이름을 입력해주세요.'})
    }

    else if(email==''){
      res.render('join/join.ejs', {'message' : '이메일을 입력해주세요.'})
    }

    else if(rows.length){
      console.log('existed member');
      res.render('join/join.ejs', {'message' : '사용중인 아이디입니다.'})
    }

    else {
      bcrypt.hash(password, null, null, function(err, hash) {
        var sql = {'id':id,'password':hash, 'name':name,'email':email};
        connection.query('insert into member set ?',sql, function(err,rows){
          if (err) {
            res.status(500).send('Something broke!');
            console.log(err.code);
          }else{
            res.redirect('/main');
          }
        })
      })
    }
  })
})

module.exports = router;
