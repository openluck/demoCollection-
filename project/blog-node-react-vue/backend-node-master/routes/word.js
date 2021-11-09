var express = require('express');
var router = express.Router();

const { create, createChild, deleted, deletedChild, listChild, list } = require('../controller/word')

/* GET users listing. */
router.post('/create', create);
router.post('/createChild', createChild);
router.delete('/deleted', deleted);
router.delete('/deletedChild', deletedChild);
router.get('/listChild', listChild);
router.get('/list', list);

module.exports = router;
