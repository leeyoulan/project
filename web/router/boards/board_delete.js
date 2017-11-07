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

router.get('/:post_num',function(req,res){
  var post_num= req.params.post_num;

  var sql = 'delete from board where post_num=?';
    connection.query(sql, post_num, function(err,rows){
      if (err) {
        res.status(500).send('Something broke!');
        console.log(err.code);
      }
    res.redirect('/board_list');
    })

})


module.exports = router;
