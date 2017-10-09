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

router.get('/:post_num/:comm_num',function(req,res){
  var post_num = req.params.post_num;
  var comm_num = req.params.comm_num;

  var sql = 'select * from comment where comm_num=?';
    connection.query(sql,comm_num, function(err,rows){
      if (err) {
        res.status(500).send('Something broke!');
        console.log(err.code);
      }else{
        if(req.user===rows[0].comm_id){
          res.render('comments/comm_update.ejs',{rows:rows});
        }else {
          var sql = 'select post_num, post_id, post_title, post_content, date_format(post_time,"%Y/%c/%e") post_time, post_hit\
                     , comm_num, comm_id, comm_content, date_format(comm_time,"%Y/%c/%e") comm_time, (select count(comm_num) from comment where post_num=?) comm_count \
                     from board join comment using(post_num) where post_num=?';
            connection.query(sql,[post_num,post_num],function(err,rows){
              if (err) {
                res.status(500).send('Something broke!');
                console.log(err.code);
              }
            res.render('boards/board_view.ejs',{rows:rows,'message':'작성하신 댓글만 수정하실 수 있습니다.'})
        })
      }
    }
  })
})


router.post('/',function(req,res){
  var post_num = req.body.post_num;
  var comm_num = req.body.comm_num;
  var comm_content = req.body.comm_content;

  var sql = 'update comment set comm_content = ? WHERE comm_num = ?';
    connection.query(sql,[comm_content, comm_num], function(err,rows){
      if (err) {
        res.status(500).send('Something broke!');
        console.log(err.code);
      }else {
        var sql = 'select post_num, post_id, post_title, post_content, date_format(post_time,"%Y/%c/%e") post_time, post_hit\
                   , comm_num, comm_id, comm_content, date_format(comm_time,"%Y/%c/%e") comm_time, (select count(comm_num) from comment where post_num=?) comm_count \
                   from board join comment using(post_num) where post_num=?';
          connection.query(sql,[post_num,post_num],function(err,rows){
            if (err) {
              res.status(500).send('Something broke!');
              console.log(err.code);
            }
          res.render('boards/board_view.ejs',{rows:rows,'message':' '})
      })
    }
    })
});

module.exports = router;
