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

router.get('/:post_num',LoggedIn,function(req,res){
  var post_num= req.params.post_num;

  var sql = 'update board set post_hit = post_hit+1 where post_num = ?';
  connection.query(sql, post_num, function(err,result){
    if (err) {
      res.status(500).send('Something broke!');
      console.log(err.code);
    }
    else {
      var sql = 'select post_num, post_id, post_title, post_content, date_format(post_time,"%Y/%c/%e") post_time, post_hit, originalFileName,savedFileName\
                 ,comm_num, comm_id, comm_content, date_format(comm_time,"%Y/%c/%e") comm_time, (select count(comm_num) from comment where post_num=?) comm_count\
                  from board join comment using(post_num) where post_num=?';
        connection.query(sql, [post_num, post_num], function(err,rows){
          if (err) {
            res.status(500).send('Something broke!');
            console.log(err.code);
          }else if(rows[0]){
            res.render('boards/board_view.ejs',{rows:rows,'userId':req.user});
          }else if(rows[0]==undefined){
            var sql = 'select post_num, post_id, post_title, post_content, date_format(post_time,"%Y/%c/%e") post_time, post_hit, originalFileName, savedFileName\
                       from board where post_num=?';
              connection.query(sql, post_num, function(err,rows){
                if (err) {
                  res.status(500).send('Something broke!');
                  console.log(err.code);
                }else{
                  res.render('boards/board_view.ejs',{rows:rows,'userId':req.user});
                }
            })
          }
        })
      }
    })
  })

  router.post('/', function(req,res){
    var comm_id = req.user;
    var post_num = req.body.post_num;
    var comm_content = req.body.comm_content;

    var sql = 'insert into comment (comm_id, post_num, comm_content) values (?,?,?)';

    connection.query(sql,[comm_id, post_num, comm_content],function(err,rows){
      if(err){
        res.status(500).send('Something broke!');
        console.log(err.code);
      }
      res.redirect('/board_view/'+post_num);
    });
  });

  function LoggedIn(req, res, next) {
    if (req.isAuthenticated()){
      next();
    } else {
      res.redirect('/login');
    }
  }

module.exports = router;
