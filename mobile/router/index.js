var express = require('express');
var app = express();
var router = express.Router();
var path = require('path');

var members = require('./members/members');
var posts = require('./posts/posts');

router.use('/members',members);
router.use('/posts',posts);

module.exports = router;
