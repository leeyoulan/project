//1.회원가입 //2.로그인 //3.로그아웃
//4.아이디 찾기 //5.비밀번호 찾기 //6.비밀번호 재설정

var express = require('express');
var app = express();
var router = express.Router();
var mysql = require('mysql');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var bcrypt = require('bcrypt-nodejs');

var pool = mysql.createPool({
  connectionLimit : 10,
  host     : 'localhost',
  port     : 3306,
  user     : 'root',
  password : '111111',
  database : 'p'
});

//1.회원가입 !!
router.post('/',function(req,res){
  var id = req.body.id;
  var password = req.body.password;
  var name = req.body.name;
  var email = req.body.email;

pool.getConnection(function(err,connection){
  if(err) console.log(err.code);

bcrypt.hash(password, null, null, function(err, hash) {
  var post = {'id':id,'password':hash,'name':name,'email':email};
  var sql = 'insert into member set ?';
  connection.query(sql,post,function(err,rows){
    if (err) {
      if (err.code==='ER_DUP_ENTRY') {
        res.json({'code':'003'});
        console.log('003');
        connection.release();
      } else {
        res.json({'code':'500'});
        console.log(err.code);
        connection.release();
      }
    } else {
      res.json({'code':'200'});
      console.log('200');
      connection.release();
    }
    });
  });
});
});

//2.로그인
router.post('/login',function(req,res){
  var id = req.body.id;
  var password = req.body.password;
pool.getConnection(function(err,connection){
  if(err) {
    res.json({'code':'500'});
    console.log(err.code);
  }

  var sql = 'select * from member where id=?';

  connection.query(sql,[id],function(err,rows){
    if (err) {
      res.json({'code':'500'});
      console.log(err.code);
      connection.release();
    }

    if(rows.length){
      bcrypt.compare(password, rows[0].password, function(err, result) {
        if (result) {
          req.session.id = id;
          res.json({'code':'200'});
          console.log('200');
          connection.release();
        } else {
            res.json({'code':'002'});
            console.log('002');
            connection.release();
          }
        })
      } else {
          res.json({'code':'001'});
          console.log('001');
          connection.release();
      }
        // if (result.length === 0) {
        //   res.json({'code':'001'});
        //   console.log('001');
        //   connection.release();
        // } else {
        //     if (password !== result[0].password){
        //       res.json({'code':'002'});
        //       console.log('002');
        //       connection.release();
        //     } else {
        //         req.session.id = id;
        //         res.json({'code':'200'});
        //         console.log('200');
        //         connection.release();
        //       }//3
        //     }//2
        //1
    })
  })
})

//3.로그아웃
router.get('/logout', function(req, res){
            req.session.destroy(function(err){
                if(err){
                  res.json({'code':'500'});
                  console.log(err.code);
                }else{
                  res.json({'code':'200'});
                  console.log('200');
                }
            })
    })

//4.아이디 찾기
router.get('/id', function(req, res){
  var name = req.body.name;
  var email = req.body.email;

  pool.getConnection(function(err,connection){
    if(err) {
      res.json({'code':'500'});
      console.log(err.code);
    }

    var sql = 'select * from member where name=? and email=?';

    connection.query(sql,[name,email],function(err,result){
      if (err) {
        res.json({'code':'500'});
        console.log(err.code);
        connection.release();
      } else {
          if (result.length === 0) {
            res.json({'code':'004'});
            console.log('004');
            connection.release();
          } else {
                  res.json({'id':result[0].id, 'code':'200'});
                  console.log('200');
                  connection.release();
                }
              }
    })
  })
})

//5.비밀번호 찾기
router.get('/pw', function(req, res){
  var id = req.body.id;
  var name = req.body.name;
  var email = req.body.email;

  pool.getConnection(function(err,connection){
    if(err) {
      res.json({'code':'500'});
      console.log(err.code);
    }
    var post = {id,name,email}
    var sql = 'select * from member where id=? and name=? and email=?';

    connection.query(sql,post,function(err,result){
      if (err) {
        res.json({'code':'500'});
        console.log(err.code);
        connection.release();
      } else {
          if (result.length === 0) {
            res.json({'code':'005'});
            console.log('005');
            connection.release();
          } else {
                  res.json({'code':'200'});
                  console.log('200');
                  connection.release();
            }
          }
    })
  })
})

//6. 비밀번호 재설정
router.put('/pw', function(req, res){
  var id = req.body.id;
  var password = req.body.password;

  pool.getConnection(function(err,connection){
    if(err) {
      res.json({'code':'500'});
      console.log(err.code);
    }

    var hash = bcrypt.hashSync(password);
    var sql = 'update member set password = ? WHERE id = ?';
    connection.query(sql,[hash,id],function(err,rows){
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
