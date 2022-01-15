var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Inventory Item Schema
var InventoryItemSchema = new Schema({
    item_id: {
        type: String,
        index: true,
        unique: true,
        required: true
    },
    item_name: String,
    tags: [String],
    category: String,
    price: mongoose.SchemaTypes.Decimal128
});

module.exports = mongoose.model('InventoryItemModel', InventoryItemSchema);