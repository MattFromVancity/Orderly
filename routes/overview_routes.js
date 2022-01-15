var express = require('express');
var router = express.Router();
var overview_controller = require('../controllers/overview_controller');

router.get('/', overview_controller.get_all_data);

module.exports = router;