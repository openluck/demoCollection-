var express = require('express');
var router = express.Router();

const { create, list, update, deleted } = require('../controller/record')

router.post('/create', create);
router.put('/update', update);
router.delete('/deleted', deleted);

router.get('/list', list);

module.exports = router;