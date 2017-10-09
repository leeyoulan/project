var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
var path = require('path');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var flash = require('connect-flash');

var router = require('./router/index');

app.listen(50005,function(){
  console.log('start! port 50005');
});

app.use(cors());
app.options('*',cors());

app.use(express.static(__dirname+'/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');

app.use(session({
  secret:'keyboard cat',
  resave:false,
  saveUninitialized:true,
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(router);
