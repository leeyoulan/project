var express = require('express');
var app = express();
var router = express.Router();
var path = require('path');
var mysql = require('mysql');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');

//database setting
var connection = mysql.createConnection({
  host     : 'localhost',
  port     : 3306,
  user     : 'root',
  password : '111111',
  database : 'p1'
});

connection.connect();

//done:비동기동작
router.get('/',function(req,res){
  var msg;
  var errMsg = req.flash('error');
  if(errMsg) msg = errMsg;
  if(errMsg=='Missing credentials'){
    msg='아이디와 비밀번호를 입력해주세요';
  }
  res.render('join.ejs',{'message': msg});
});

//3
passport.serializeUser(function(user,done){
  console.log('passport session save :',user.id);
  done(null,user.id);
})

//4
passport.deserializeUser(function(id,done){
  console.log('passport session get id');
  done(null,id);
})

//1
passport.use('local-join',new LocalStrategy({
  usernameField: 'id',
  passwordField: 'password',
  passReqToCallback : true
}, function(req,id,password,done){
    var repassword = req.body.repassword;
    var name = req.body.name;
    var email = req.body.email;

  var query = connection.query('select * from member where id=?',[id],function(err,rows){
    if(err) return done(err);

    if(repassword==''){
      return done(null,false, {message : '비밀번호를 재입력해주세요.'})
    }

    if(name==''){
      return done(null,false, {message : '이름을 입력해주세요.'})
    }

    if(email==''){
      return done(null,false, {message : '이메일을 입력해주세요.'})
    }

    if(password!==repassword){
      return done(null,false, {message : '비밀번호가 일치하지 않습니다.'})
    }

    if(rows.length){
      console.log('existed member');
      return done(null,false, {message : '사용중인 아이디입니다.'})//message:flash사용
    } else {
        bcrypt.hash(password, null, null, function(err, hash) {
          var sql = {'id':id,'password':hash, 'name':name,'email':email};
          var query = connection.query('insert into member set ?',sql, function(err,rows){
            if(err) throw err;
            return done(null, {'id': id});
      })
    })
    }
})
}
));

//2
router.post('/',passport.authenticate('local-join',{
  successRedirect : '/login',
  failureRedirect : '/join',
  failureFlash : true
}))

module.exports = router;
