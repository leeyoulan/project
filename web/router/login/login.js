var express = require('express');
var app = express();
var router = express.Router();
var mysql = require('mysql');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
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

//router
router.get('/',function(req,res){
  var msg;
  var errMsg = req.flash('error');
  if(errMsg) msg = errMsg;
  if(errMsg=='Missing credentials'){
    msg='아이디와 비밀번호를 입력해주세요';
  }
  res.render('login/login.ejs',{'message': msg});
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
passport.use('local-login',new LocalStrategy({
  usernameField: 'id',
  passwordField: 'password',
  passReqToCallback : true
}, function(req,id,password,done){
  var query = connection.query('select * from member where id=?', [id], function(err,rows){
    if(err) return done(err);

    if(rows.length){
      bcrypt.compare(password, rows[0].password, function(err, res) {
        if (res) {
          return done(null, {'id' : id });
        } else {
          return done(null, false, {'message' : '비밀번호가 일치하지 않습니다.'});
        }
      })
    } else {
      return done(null,false,{'message': '존재하지 않는 사용자 입니다.'});
    }
  })
}
));

//2
router.post('/',passport.authenticate('local-login',{
  successRedirect : '/main',
  failureRedirect : '/login',
  failureFlash : true
}))

module.exports = router;
