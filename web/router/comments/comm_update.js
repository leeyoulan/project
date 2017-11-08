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

router.get('/:post_num/:comm_num',function(req,res){
  var post_num = req.params.post_num;
  var comm_num = req.params.comm_num;

  var sql = 'select * from comment where comm_num=?';
    connection.query(sql,comm_num, function(err,rows){
      if (err) {
        res.status(500).send('Something broke!');
        console.log(err.code);
      }
      res.render('comments/comm_update.ejs',{rows:rows,'userId':req.user});
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
      }
      res.redirect('/board_view/'+post_num)
    })
});

module.exports = router;
