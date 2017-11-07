var express = require('express');
var app = express();
var router = express.Router();

var join = require('./join/join')
var login = require('./login/login')
var logout = require('./logout/logout')
var board_list = require('./boards/board_list')
var board_view = require('./boards/board_view')
var board_write = require('./boards/board_write')
var board_update = require('./boards/board_update')
var board_delete = require('./boards/board_delete')
var comm_update = require('./comments/comm_update')
var comm_delete = require('./comments/comm_delete')
var find_id = require('./find/find_id')
var find_pw = require('./find/find_pw')
var re_pw = require('./find/re_pw')
var main = require('./main/main')
var upload = require('./upload/upload')
var uploadUpdate = require('./upload/uploadUpdate')
var download = require('./download/download')
var board_search = require('./boards/board_search')

router.use('/join',join);
router.use('/login',login);
router.use('/logout',logout);
router.use('/board_list',board_list);
router.use('/board_view',board_view);
router.use('/board_write',board_write);
router.use('/board_update',board_update);
router.use('/board_delete',board_delete);
router.use('/comm_update',comm_update);
router.use('/comm_delete',comm_delete);
router.use('/find_id',find_id);
router.use('/find_pw',find_pw);
router.use('/re_pw',re_pw);
router.use('/main',main);
router.use('/upload',upload);
router.use('/uploadUpdate',uploadUpdate);
router.use('/download',download);
router.use('/board_search',board_search);

module.exports = router;
