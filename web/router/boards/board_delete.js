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

  var sql = 'select * from board where post_num=?';
    connection.query(sql,post_num, function(err,rows){
      if (err) {
        res.status(500).send('Something broke!');
        console.log(err.code);
      }else{
        if(req.user===rows[0].post_id){
          res.render('boards/board_delete.ejs',{'post_num':post_num});
        }else {
          var sql = 'select post_num, post_id, post_title, post_content, date_format(post_time,"%Y/%c/%e") post_time, post_hit,\
                    (select count(comm_num) from comment c where b.post_num=c.post_num) comm_count from board b;'
            connection.query(sql,function(err,rows){
              if (err) {
                res.status(500).send('Something broke!');
                console.log(err.code);
              }
            res.render('boards/board_list.ejs',{rows:rows,'message':'작성하신 글만 삭제하실 수 있습니다.'})
        })
      }
    }
  })

})

router.post('/',function(req,res){
  var post_num= req.body.post_num;
  var post_title = req.body.post_title;
  var post_content = req.body.post_content;

  var sql = 'delete from board where post_num=?';
    connection.query(sql, post_num, function(err,rows){
      if (err) {
        res.status(500).send('Something broke!');
        console.log(err.code);
      }
    res.redirect('/board_list');
    })
});

module.exports = router;
