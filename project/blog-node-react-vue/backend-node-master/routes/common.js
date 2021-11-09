var express = require('express');
var router = express.Router();

const { uploadAvatar, uploadPoster, uploadPhoto } = require('../controller/common')

router.post('/uploadAvatar', uploadAvatar);
router.post('/uploadPoster', uploadPoster);
router.post('/uploadPhoto', uploadPhoto);


module.exports = router;