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

router.get('/',LoggedIn,function(req,res){
  res.render('boards/board_write',{'userId':req.user});
})

router.post('/', function(req,res){
  var post_id = req.user;
  var post_title = req.body.post_title;
  var post_content = req.body.post_content;
  var originalFileName = req.body.originalFileName;
  var savedFileName = req.body.savedFileName;
  var fileSize = req.body.fileSize;
  var filePath = req.body.filePath;

  if (savedFileName) {

    var sql = 'insert into board (post_id, post_title, post_content, originalFileName, savedFileName, fileSize, filePath) values (?,?,?,?,?,?,?)';

    connection.query(sql,[post_id, post_title, post_content, originalFileName, savedFileName, fileSize, filePath],function(err,rows){
      if(err){
        res.status(500).send('Something broke!');
        console.log(err.code);
      }
      res.redirect('/board_list');
    });
  } else {
    var sql = 'insert into board (post_id, post_title, post_content) values (?,?,?)';

    connection.query(sql,[post_id, post_title, post_content],function(err,rows){
      if(err){
        res.status(500).send('Something broke!');
        console.log(err.code);
      }
      res.redirect('/board_list');
    });
  }
});

function LoggedIn(req, res, next) {
  if (req.isAuthenticated()){
    next();
  } else {
    res.redirect('/login');
  }
}

module.exports = router;
