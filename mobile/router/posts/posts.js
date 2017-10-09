//1.게시글목록 //2.1 게시글 상세 //2.2 댓글상세//3.글쓰기 //4.댓글쓰기
//5.글수정 //6.댓글수정 //7.글삭제 //8.댓글삭제
var express = require('express');
var app = express();
var router = express.Router();
var mysql = require('mysql');
var session = require('express-session');

var pool = mysql.createPool({
  connectionLimit : 10,
  host     : 'localhost',
  port     : 3306,
  user     : 'root',
  password : '111111',
  database : 'p'
});

//1.게시글 목록
router.get('/',function(req,res){

pool.getConnection(function(err,connection){
  if (err) {
      res.json({'code':'500'});
      console.log(err.code);
  }

  var sql = 'SELECT post_num, post_id, post_title, post_content, DATE_FORMAT(post_time,"%Y/%c/%e") post_time, post_hit,\
           (SELECT COUNT(comm_num) FROM COMMENT c WHERE b.post_num=c.post_num) comm_count FROM board b;';
  connection.query(sql,function(err,result){
    if (err) {
        res.json({'code':'500'});
        console.log(err.code);
        connection.release();
    } else {

      var result_sql = [];

      for (var i = 0; i < result.length; i++) {
        result_sql.push({'post_num' : result[i].post_num,
                          'post_id' : result[i].post_id,
                          'post_title' : result[i].post_title,
                          'post_time' : result[i].post_time,
                          'post_hit' : result[i].post_hit,
                          'comm_count' : result[i].comm_count
                          });
      }
      res.json(result_sql);
      console.log('200');
      connection.release();
    }
    });
  });
});

//2.1게시글 상세
router.get('/details',function(req,res){
  var post_num = req.query.post_num;

pool.getConnection(function(err,connection){
  if (err) {
      res.json({'code':'500'});
      console.log(err.code);
  }

  var sql = 'update board set post_hit = post_hit+1 where post_num = ?';
  connection.query(sql, post_num, function(err,result){
    if (err) {
        res.json({'code':'500'});
        console.log(err.code);
        connection.release();
    } else {
      pool.getConnection(function(err,connection){
        if (err) {
            res.json({'code':'500'});
            console.log(err.code);
        }

        var sql = 'select post_id, post_title, post_content, date_format(post_time,"%Y/%c/%e") post_time, post_hit\
                    from board where post_num=?';
        connection.query(sql, post_num, function(err,result){
          if (err) {
              res.json({'code':'500'});
              console.log(err.code);
              connection.release();
          } else {
              var result_sql = [];
              for (var i = 0; i < result.length; i++) {
                result_sql.push({ 'post_id' : result[i].post_id,
                                  'post_title' : result[i].post_title,
                                  'post_content' : result[i].post_content,
                                  'post_time' : result[i].post_time,
                                  'post_hit' : result[i].post_hit
                                  });
                                }
            res.json(result_sql);
            console.log('200');
            connection.release();
            }
          });
        });
      }
    });
  });
});


//2.2 댓글 상세
router.get('/comments',function(req,res){
  var post_num = req.query.post_num;

pool.getConnection(function(err,connection){
  if (err) {
      res.json({'code':'500'});
      console.log(err.code);
  }

  var sql = 'select comm_num, (select count(comm_num) from comment) comm_count, comm_id, comm_content, date_format(comm_time,"%Y/%c/%e") comm_time from comment where post_num=?';
  connection.query(sql,post_num,function(err,result){
    if (err) {
        res.json({'code':'500'});
        console.log(err.code);
        connection.release();
    } else {
        var result_sql = [];
        for (var i = 0; i < result.length; i++) {
          result_sql.push({ 'comm_num' : result[i].comm_num,
                            'comm_count' : result[i].comm_count,
                            'comm_id' : result[i].comm_id,
                            'comm_content' : result[i].comm_content,
                            'comm_time' : result[i].comm_time,
                            });
                          }
      res.json(result_sql);
      console.log('200');
      connection.release();
      }
    });
  });
});

//3.글쓰기
router.post('/',function(req,res){
  var post_id = req.body.post_id;
  var post_title = req.body.post_title;
  var post_content = req.body.post_content;
  var post_time = req.body.post_time;

  pool.getConnection(function(err,connection){
    if (err) {
        res.json({'code':'500'});
        console.log(err.code);
    }

    var sql = "insert into board (post_id, post_title, post_content, post_time) values (?,?,?,?)";
    connection.query(sql,[post_id, post_title, post_content, post_time],function(err,rows){
      if (err) {
          res.json({'code':'500'});
          console.log(err.code);
          connection.release();
        } else {
        res.json({'code':'200'});
        console.log('200');
        connection.release();
      }
      });
    });
});

//4.댓글쓰기
router.post('/comments',function(req,res){
  var post_num = req.body.post_num;
  var comm_id = req.body.comm_id;
  var comm_content = req.body.comm_content;
  var comm_time = req.body.comm_time;

  pool.getConnection(function(err,connection){
    if (err) {
        res.json({'code':'500'});
        console.log(err.code);
    }

    var sql = "insert into comment (post_num, comm_id, comm_content, comm_time) values (?,?,?,?)";
    connection.query(sql,[post_num, comm_id, comm_content, comm_time],function(err,rows){
      if (err) {
          res.json({'code':'500'});
          console.log(err.code);
          connection.release();
        } else {
        res.json({'code':'200'});
        console.log('200');
        connection.release();
      }
      });
    });
});

//5.글수정
router.put('/',function(req,res){
  var post_num = req.body.post_num;
  var post_title = req.body.post_title;
  var post_content = req.body.post_content;

  pool.getConnection(function(err,connection){
    if (err) {
        res.json({'code':'500'});
        console.log(err.code);
    }

    var sql = 'update board set post_title = ?, post_content = ? WHERE post_num = ?';

    connection.query(sql,[post_title, post_content, post_num],function(err,rows){
      if (err) {
        res.json({'code':'500'});
        console.log(err.code);
        connection.release();
      } else {
          res.json({'code':'200'});
          console.log('200');
          connection.release();
        }
    })
  })
})

//6.댓글수정
router.put('/comments',function(req,res){
  var post_num = req.body.post_num;
  var comm_num = req.body.comm_num;
  var comm_content = req.body.comm_content;

  pool.getConnection(function(err,connection){
    if (err) {
        res.json({'code':'500'});
        console.log(err.code);
    }

    var sql = 'update comment set comm_content = ? WHERE post_num = ? and comm_num = ?';

    connection.query(sql, [comm_content, post_num, comm_num],function(err,rows){
      if (err) {
        res.json({'code':'500'});
        console.log(err.code);
        connection.release();
      } else {
          res.json({'code':'200'});
          console.log('200');
          connection.release();
        }
    })
  })
})

//7.글삭제
router.delete('/',function(req,res){
  var post_num = req.body.post_num;

  pool.getConnection(function(err,connection){
    if (err) {
        res.json({'code':'500'});
        console.log(err.code);
    }

    var sql = 'delete from board WHERE post_num = ?';

    connection.query(sql,[post_num],function(err,rows){
      if (err) {
        res.json({'code':'500'});
        console.log(err.code);
        connection.release();
      } else {
          res.json({'code':'200'});
          console.log('200');
          connection.release();
        }
    })
  })
})

//8.댓글삭제
router.delete('/comments',function(req,res){
  var post_num = req.body.post_num;
  var comm_num = req.body.comm_num;

  pool.getConnection(function(err,connection){
    if (err) {
        res.json({'code':'500'});
        console.log(err.code);
    }

    var sql = 'delete from comment WHERE comm_num = ?';

    connection.query(sql,[comm_num],function(err,rows){
      if (err) {
        res.json({'code':'500'});
        console.log(err.code);
        connection.release();
      } else {
          res.json({'code':'200'});
          console.log('200');
          connection.release();
        }
    })
  })
})

module.exports = router;
