var express = require('express');
var router = express.Router();


const { create, addPhoto, deletePhoto, deleted, list, photoList, update } = require('../controller/album')

router.post('/create', create)
router.post('/addPhoto', addPhoto)
router.delete('/deletePhoto', deletePhoto)
router.delete('/deleted', deleted)
router.get('/list', list)
router.get('/photoList', photoList)
router.patch('/update', update)


module.exports = router