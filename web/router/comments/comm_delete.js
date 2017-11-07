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

  var sql = 'delete from comment where comm_num=?';
    connection.query(sql, comm_num, function(err,rows){
      if (err) {
        res.status(500).send('Something broke!');
        console.log(err.code);
      }else{
      res.redirect('/board_view/'+post_num)
    }
  })

})


module.exports = router;
