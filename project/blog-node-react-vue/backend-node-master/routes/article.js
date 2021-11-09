var express = require('express');
var router = express.Router();


const { create, list, detail, update, giveFive, deleted } = require('../controller/article')

router.post('/create', create)
router.get('/list', list)
router.get('/detail', detail)
router.put('/update', update)
router.patch('/giveFive', giveFive)
router.delete('/deleted', deleted)


module.exports = router