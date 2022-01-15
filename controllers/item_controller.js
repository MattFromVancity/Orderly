var InventoryItem = require('../models/InventoryItemModel');
const Warehouse = require('../models/WarehouseModel');
const {body, validationResult} = require('express-validator');
const db_utility = require('../db_utils');

//Creation of items
exports.item_create = [ body('item_name', 'Item Name is required.').isLength({'min': 1}).trim().escape(),
    body('item_id', 'Item ID required.').isLength({'min': 1}).trim().escape(),
    body('item_price', 'Item Price must be a floating point value.').isNumeric().trim().escape().toFloat(),
    (req, res) => {
    var errors = validationResult(req);
    if(!errors.isEmpty()){
        res.redirect('/');
    }else {
        //Verify the item does not already exist in the DB
        InventoryItem.find({'item_id': req.body.item_id}, (err, items) =>{
            if(err) throw err;
            if(items.length > 0){
                console.log(`${items[0].item_name} already exists in database with item_id = ${items[0].item_id}`);
                res.redirect('/');
            }else{
                InventoryItem.create({
                    'item_name': req.body.item_name,
                    'item_id': req.body.item_id,
                    'price': req.body.item_price
                }, (err) => {
                    if(err) throw err;
                    console.log(`${req.body.item_name} has been sucessfully added to Orderly's database.`);
                    res.redirect('/');
                });
            }
    });
}}];

//Function to server the update item form
exports.item_update_serve_form = [body('item_price', 'Issue').trim().escape(),(req, res) => {
    validationResult(req);
    res.render('update_item', {item_id: req.body.item_id, 
        item_name: req.body.item_name,
        old_item_id: req.body.item_id,
        item_price: parseFloat(req.body.item_price)
    });
}];

//Function to server a POST request from the update item form
exports.item_update_process_form = [ body('item_name', 'Item Name is required.').isLength({'min': 1}).trim().escape(),
    body('old_item_id', 'Item ID required.').isLength({'min': 1}).trim().escape(),
    body('new_item_id', 'Item ID required.').isLength({'min': 1}).trim().escape(),
    body('item_price', 'Item Price must be a floating point value.').trim().escape().toFloat(), async (req, res) => {
        var errors = validationResult(req);
        if(errors.isEmpty()){
            let newItem = {
                'item_name': req.body.item_name,
                'item_id': req.body.new_item_id,
                'item_price': req.body.item_price
            };
            //Update all warehouses with the updated item
            const all_warehouses = await Warehouse.find({});
            for(var i = 0; i < all_warehouses.length; i++){
                let updatedItems = db_utility.warehouseUpdateItem(all_warehouses[i].warehouse_items, {'item_id': req.body.old_item_id}, newItem);
                await Warehouse.updateOne({'warehouse_id': all_warehouses[i].warehouse_id}, {
                    'warehouse_items': updatedItems
                });
            }
            //Update the inventory item
            InventoryItem.updateOne({'item_id': req.body.old_item_id}, {'item_name': req.body.item_name,
            'item_id': req.body.new_item_id,
            'price': req.body.item_price}, (err) => {
                if(err) throw err;
                res.redirect('/');
            });
        }else{
            res.redirect('/error');
        }
}];

//Delete an item
exports.item_delete = async (req, res) => {
    //Validate no items exist in any of the warehouses
    const all_warehouses = await Warehouse.find({});
    for(var i = 0; i < all_warehouses.length; i++){
        let nItems = db_utility.warehouseRemoveItems(all_warehouses[i].warehouse_items, {'item_id': req.body.item_id}, db_utility.MAX_ITEM_REMOVAL);
        await Warehouse.updateOne({'warehouse_id': all_warehouses[i].warehouse_id}, {'warehouse_items': nItems});
    }
    //Remove item instance once deleted from all warehouse instances
    InventoryItem.deleteOne({'item_id': req.body.item_id}, (err) => {
        if(err) throw err;
        console.log(`${req.body.item_id} has been removed from orderlyDB`);
        res.redirect('/');
    });
};


