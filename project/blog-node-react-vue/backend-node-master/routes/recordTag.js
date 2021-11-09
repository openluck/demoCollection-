var express = require('express');
var router = express.Router();

const { create, update, list, deleted } = require('../controller/recordTag')

router.post('/create', create);
router.patch('/update', update);
router.get('/list', list);
router.delete('/deleted', deleted);

module.exports = router;