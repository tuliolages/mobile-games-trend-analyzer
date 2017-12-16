'use strict';

var express = require('express');
var controller = require('./placement.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/games/:id/placements', controller.show);
router.get('/genres/:id/placements', controller.showGenre);
router.post('/', controller.create);

module.exports = router;
