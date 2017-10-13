var express = require('express');
var app = express();
var router = express.Router();

router.get('/:savedFileName', function(req, res){
  var savedFileName = req.params.savedFileName;
  res.download('C:\\Users\\youlan\\Desktop\\nodejs(fileupload)\\web\\uploads\\'+savedFileName);
});

module.exports = router;
