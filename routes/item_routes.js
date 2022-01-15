var express = require('express');
var router = express.Router();
var item_controller = require('../controllers/item_controller');

//Create Item Route
router.post('/item_create', item_controller.item_create);

//Update Item Routes
router.post('/item_update', item_controller.item_update_serve_form);
router.post('/item_update_content', item_controller.item_update_process_form);

//Delete Item Route
router.post('/item_delete', item_controller.item_delete);

module.exports = router;