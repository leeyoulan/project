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
  res.render('boards/board_write');
})

router.post('/', function(req,res){
  var post_id = req.user;
  var post_title = req.body.post_title;
  var post_content = req.body.post_content;

  var sql = 'insert into board (post_id, post_title, post_content) values (?,?,?)';

  connection.query(sql,[post_id, post_title, post_content],function(err,rows){
    if(err){
      res.status(500).send('Something broke!');
      console.log(err.code);
    }
    res.redirect('/board_list');
  });
});


module.exports = router;
