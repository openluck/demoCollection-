var express = require('express');
const { varifyToken, errorToken } = require('../utils/verifyToken')
var router = express.Router();

/* GET users listing. */
router.use(varifyToken()); // 接收所有请求验证
router.use('/user', require('./user'));
router.use('/article', require('./article'));
router.use('/articleClassify', require('./articleClassify'));
router.use('/word', require('./word'));
router.use('/album', require('./album'));
router.use('/record', require('./record'));
router.use('/recordTag', require('./recordTag'));
router.use('/common', require('./common'));
router.use(errorToken)
module.exports = router;