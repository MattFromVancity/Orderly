const Warehouse = require('../models/WarehouseModel');
const Address = require('../models/AddressModel');
const Inventory = require('../models/InventoryItemModel');
const {body, validationResult} = require('express-validator');
const {warehouseAddItems, warehouseRemoveItems, handleErrors} = require('../db_utils');

//Function to retrive all item within a warehouse
exports.warehouse_inventory = (req, res) => {
    const warehouse_id= req.query.warehouse_id;
    var error_arr;
    Warehouse.findOne({'warehouse_id': warehouse_id}, ['warehouse_name', 'warehouse_items'], (err, data) => {
        if(err) handleErrors(err, error_arr);
        res.render('warehouse_inventory', {
            'warehouse_name': data.warehouse_name,
            'warehouse_items': data.warehouse_items,
            'warehouse_id': warehouse_id
        });
    });
};

//Function to create and validate database warehouse entires
exports.warehouse_create = [body('warehouse_name', 'Warehouse name must be a String').trim().escape(),
    body('warehouse_id', 'Warehouse ID must be a String').trim().escape(),
    body('street_name', 'Street Name must be a String').trim().escape(),
    body('street_number', 'Street Number must be an Integer').trim().escape(),
    body('postal_code', 'Postal or Zip Code must be less than 9 characters').trim().escape().isLength({'max':9}),
    body('country').trim().escape(),
    async (req, res) => {
        const errors= validationResult(req);
        //Form validation errors
        if(!errors.isEmpty()){
            res.redirect('/');
        }
        //Only one warehouse_id may exist
        const exists_q = Warehouse.findOne({
            'warehouse_id': req.body.warehouse_id});
        const result = await exists_q;
        
        //If warehouse_id exists return an error else create an Address entry and Warehouse entry sequentially.
        if(result){
            res.redirect('/');
        }else {
            const addres_q = Address.create({
                    'street_info': {
                        'street_number': req.body.street_number,
                        'street_name': req.body.street_name
                    },
                    'postal_code': req.body.postal_code,
                    'country': req.body.country
            }).catch((errors) => {handleErrors(errors, req)});
            await Warehouse.create({
                'warehouse_id': req.body.warehouse_id,
                'warehouse_name': req.body.warehouse_name,
                'address_id': (await addres_q)._id
            }).catch((errors) => {handleErrors(errors, req)});
        }
        res.redirect('/');
}];

//Contronller to add a item to a warehouse
exports.add_item = [ body('warehouse_id').trim().escape(),
    body('item_id').trim().escape(),
    body('item_count').toInt().escape(),
    async (req, res) => {
        //Validation
        const errors = validationResult(req);
        let item = await Inventory.findOne({"item_id": req.body.item_id});
        let warehouse = await Warehouse.findOne({"warehouse_id": req.body.warehouse_id});
        //Handle item addition
        if(item != null && warehouse != null){
            const newItemList = warehouseAddItems(warehouse.warehouse_items, item, parseInt(req.body.item_count));
            await Warehouse.updateOne({'warehouse_id': req.body.warehouse_id}, {'warehouse_items': newItemList}).exec();
            res.redirect('/warehouse/warehouse_inventory?warehouse_id='+req.body.warehouse_id);
        }else {
            res.redirect('/');
        }
}];

//Controller to remove an item form a warehouse
exports.remove_item = [ body('warehouse_id').trim().escape(),
    body('item_id').trim().escape(),
    body('item_count').isNumeric().toInt(),
    async (req, res) => {
        //Validation
        const errors = validationResult(req);
        let warehouse = await Warehouse.findOne({'warehouse_id': req.body.warehouse_id});
        let item = await Inventory.findOne({"item_id": req.body.item_id});
        let newItemArr = warehouseRemoveItems(warehouse.warehouse_items, item, req.body.item_count);
        await Warehouse.updateOne({'warehouse_id': warehouse.warehouse_id}, {'warehouse_items': newItemArr});
        res.redirect('/warehouse/warehouse_inventory?warehouse_id='+req.body.warehouse_id);
}];

//Controller to delete associated Warehouse
exports.warehouse_delete = [body('warehouse_id').trim().escape(),
    (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty())
            handleErrors(errors, req);
        else {
            Warehouse.deleteOne({'warehouse_id': req.body.warehouse_id}, (err) => {
                if(err) throw err;
            });
        }
        res.redirect('/');
}];