var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AddressSchema = new Schema({
    country: {
        type: String,
        requird: true
    },
    postal_code: {
        type: String,
        maxlength: 9,
        required: true
    },
    province_code: {
        type: String
    },
    street_info: {
        street_number: {type: Number, required: true},
        street_name: {type: String, required: true}
    }
});

module.exports = mongoose.model('AddressModel', AddressSchema);