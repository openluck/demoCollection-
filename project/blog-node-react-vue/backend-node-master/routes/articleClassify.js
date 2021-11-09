var express = require('express');
var router = express.Router();


const { create, update, deleted, list } = require('../controller/articleClassify')

router.post('/create', create)
router.patch('/update', update)
router.delete('/deleted', deleted)
router.get('/list', list)


module.exports = router