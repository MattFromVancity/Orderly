var express = require('express');
var router = express.Router();
var warehouse_controller = require('../controllers/warehouse_controller');

//Overview of Warehouses
router.get('/warehouse_inventory', warehouse_controller.warehouse_inventory);

//Addition of warehouses
router.post('/warehouse_create', warehouse_controller.warehouse_create);

//Addition of item into a warehouse
router.post('/warehouse_add_item', warehouse_controller.add_item);

//Removal of item(s) from a warehouse
router.post('/warehouse_remove_items', warehouse_controller.remove_item);

//Deleteion of a warehouse instance
router.post('/warehouse_delete', warehouse_controller.warehouse_delete);

module.exports = router;