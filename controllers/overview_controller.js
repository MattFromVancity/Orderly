const InventoryItemModel = require('../models/InventoryItemModel');
const WarehouseModel = require('../models/WarehouseModel');
const db_utility = require('../db_utils');

//Controller to retrieve all data for the overview page
exports.get_all_data = async (req, res) => {
    const items = await InventoryItemModel.find({}, 'item_name item_id price').catch((err) => {
        if(err) db_utility.handleErrors(err, req);
    });
    const warehouses = await WarehouseModel.find({}, 'warehouse_name warehouse_id warehouse_items address_id').catch((err) => {
        if(err) db_utility.handleErrors(err, req);
    });
    res.render('main', {
        warehouse_list: warehouses,
        item_list: items,
        errors: ["Internal Error"]
    });
};