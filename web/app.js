// Express 기본 모듈 불러오기
var express = require('express');
var path = require('path');

// Express의 미들웨어 불러오기
var bodyParser = require('body-parser');

// Session 미들웨어 불러오기
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var flash = require('connect-flash');

// 파일 업로드용 미들웨어
var multer = require('multer');
var fs = require('fs');

//클라이언트에서 ajax로 요청 시 CORS(다중 서버 접속) 지원
var cors = require('cors');

// 익스프레스 객체 생성
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname+'/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use('/users', express.static('uploads'))

app.set('view engine', 'ejs');

app.use(session({
  secret:'keyboard cat',
  resave:false,
  saveUninitialized:true,
}));

app.use(cors());
app.options('*',cors());

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

var router = require('./router/index');

var count=1;
io.on('connection', function(socket){ //3
  console.log('user connected: ', socket.id);  //3-1
  var name = "사용자" + count++;                 //3-1
  io.to(socket.id).emit('change name',name);   //3-1

  socket.on('disconnect', function(){ //3-2
    console.log('user disconnected: ', socket.id);
  });

  socket.on('send message', function(name,text){ //3-3
    var msg = name + ' : ' + text;
    console.log(msg);
    io.emit('receive message', msg);
  });
});

http.listen(50005,function(){
  console.log('start! port 50005');
});

app.use(router);
