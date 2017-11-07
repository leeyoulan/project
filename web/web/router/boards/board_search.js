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

router.get('/', function(req,res){
  var boardSearch = req.query.boardSearch;

  var sql ='select post_num, post_id, post_title, post_content, date_format(post_time,"%Y/%c/%e") post_time, post_hit,\
           (select count(comm_num) from comment c where b.post_num=c.post_num) comm_count from board b where binary(post_title) like' + connection.escape('%'+req.query.boardSearch+'%');

  connection.query(sql,function(err,rows){
    if(err){
      res.status(500).send('Something broke!');
      console.log(err.code);
    }else if(rows[0]==undefined) {
      res.render('boards/board_search.ejs',{'userId':req.user})
    }
    else {
      res.render('boards/board_list.ejs',{rows:rows,'userId':req.user});
    }
  })
});

module.exports = router;
