var mongoose = require('mongoose');
const ItemModel = require('./InventoryItemModel');
var Schema = mongoose.Schema;

var WarehouseSchema = new Schema({
    warehouse_id: {
        type: String,
        required: true,
        unique: true
    },
    address_id: {
        type: mongoose.SchemaTypes.ObjectId,
        unqiue: true,
        ref: 'Address'
    },
    warehouse_name: {
        type: String,
        required: true
    },
    warehouse_items: []
});

module.exports = mongoose.model('WarehouseModel', WarehouseSchema);