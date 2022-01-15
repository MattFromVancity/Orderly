//Preparation of mongoose connection
var mongoose = require('mongoose');

//PLEASE MODIFY THIS WITH SUPPLIED CREDENTIALS
var mongoDB = "<replace_with_credentials>";

//Create an connection instance with local database
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//Sentinel value for removing all instances of an item from a warehouse instance
const MAX_ITEM_REMOVAL = -1;

//Error handling for async controllers
function handleErrors(err, req){
    console.error(`${err}`);
    req.flash('errors', [{msg: 'Internal Server Error. Please try again!'}]);
}

//Adds an item to a warehouse instance
function warehouseAddItems(itemArr, itemToAdd, count){
    var idxFound = 0;
    while(idxFound < itemArr.length && itemArr[idxFound].item_id != itemToAdd.item_id){
        idxFound += 1;
    }
    //Item has been found
    if(idxFound < itemArr.length) {
        itemArr[idxFound].item_count += count
    }else {
        itemArr.push({
            'item_id': itemToAdd.item_id,
            'item_name': itemToAdd.item_name,
            'item_count': count
        });
    }
    return itemArr;
}

//Removes an item with a specified count from a warehouse instance
function warehouseRemoveItems(itemArr, itemToRemove, count){
    var idxFound = 0;

    while(idxFound < itemArr.length && itemArr[idxFound].item_id != itemToRemove.item_id)
        idxFound += 1;
    //Item has been found
    if(idxFound < itemArr.length){
        itemArr[idxFound].item_count = (itemArr[idxFound].item_count > count ? itemArr[idxFound].item_count - count : 0);
        if(itemArr[idxFound].item_count == 0 || count == MAX_ITEM_REMOVAL)
            itemArr.splice(idxFound, 1);
    }
    return itemArr;
}

//Updates an item within a warehouse
function warehouseUpdateItem(itemArr, oldItem, newItem){
    var idxFound = 0;
    while(idxFound < itemArr.length && itemArr[idxFound].item_id != oldItem.item_id)
        idxFound += 1;
    if( itemArr.length > 0 && idxFound < itemArr.length ){
        itemArr[idxFound].item_name = newItem.item_name;
        itemArr[idxFound].item_id = newItem.item_id;
    }
    return itemArr;
}

module.exports = {db, warehouseAddItems, warehouseRemoveItems, warehouseUpdateItem, MAX_ITEM_REMOVAL};