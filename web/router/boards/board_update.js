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
          res.render('boards/board_update.ejs',{rows:rows,'userId':req.user});
        }
  })
})

router.post('/', function(req,res){
  var post_id = req.user;
  var post_num = req.body.post_num;
  var post_title = req.body.post_title;
  var post_content = req.body.post_content;
  var originalFileName = req.body.originalFileName;
  var savedFileName = req.body.savedFileName;
  var fileSize = req.body.fileSize;
  var filePath = req.body.filePath;

  if (savedFileName) {

    var sql = 'update board set  post_title = ?, post_content = ?, originalFileName = ?,  savedFileName = ?, fileSize = ?, filePath = ? where post_num=?';

    connection.query(sql,[post_title, post_content, originalFileName, savedFileName, fileSize, filePath, post_num],function(err,rows){
      if(err){
        res.status(500).send('Something broke!');
        console.log(err.code);
      }
      res.redirect('/board_view/'+post_num);
    });
  } else {
    var sql = 'update board set post_title = ?, post_content = ? where post_num = ?';

    connection.query(sql,[post_title, post_content, post_num],function(err,rows){
      if(err){
        res.status(500).send('Something broke!');
        console.log(err.code);
      }
      res.redirect('/board_view/'+post_num);
    })
  }
});


module.exports = router;
