var express = require('express');
var router = express.Router();

const { login, register, info, deleted, adminLogin, update, list } = require('../controller/user')

/* GET users listing. */
router.post('/login', login);
router.post('/adminLogin', adminLogin);
router.post('/register', register);
router.get('/info', info);
router.put('/update', update);
router.delete('/deleted', deleted);
router.get('/list', list);

module.exports = router;
