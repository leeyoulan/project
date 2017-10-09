// module, middle-ware 불러오기
var express = require('express');
var app = express(); // express 객체 생성
var path = require('path');
var bodyParser  = require('body-parser');

var mysql = require('mysql');

var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);

// router 설정
var router = require('./router/index');

// 서버시작
app.listen(55555, function () {
  console.log('start!! 55555 port');
});

// body-parser를 이용해 application/json 파싱
app.use(bodyParser.json());

//session 호출
app.use(session({
  secret:'keyboard cat',
  resave:false,
  saveUninitialized:true,
  store:new MySQLStore({
    host     : 'localhost',
    port     : 3306,
    user     :'root',
    password :'111111',
    database :'p'
  })
}));

app.use(router);
