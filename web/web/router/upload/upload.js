var express = require('express');
var app = express();
var router = express.Router();
var multer = require('multer');
var fs = require('fs');
var path = require('path');

//multer 미들웨어 사용 : 미들웨어 사용 순서 중요  body-parser -> multer -> router
// 파일 제한 : 5MB
var maxFileSize = 1024 * 1024 * 5;
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'uploads')// 콜백함수를 통해 전송된 파일 저장 디렉토리 설정
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + '-'+ file.originalname)// 콜백함수를 통해 전송된 파일 이름 설정
    }
});

var upload = multer({
    storage: storage,
    limits: {fileSize : maxFileSize}
  });

router.get('/', function(req, res){
  res.render('upload/upload.ejs');
});

router.post('/', upload.single('userfile'),function(req, res){
        if (req.file!=undefined) {
          var files = req.file;
          var originalFileName = files.originalname;
          var savedFileName = files.filename;
          var fileSize = files.size;
          var filePath = path.join('C:\\Users\\youlan\\Desktop\\node_project\\web',files.path);
          var fileDetail2 = {'originalFileName':originalFileName,'savedFileName':savedFileName,'fileSize':fileSize,'filePath':filePath};
          var fileDetail = JSON.stringify(fileDetail2);
          res.send(fileDetail);
        }
});


module.exports = router;
