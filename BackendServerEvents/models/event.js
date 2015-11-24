var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EventSchema = new Schema({
    name: String,
    date: Date,
    location: {
        streetname: String,
        postalcode: Number,
        town: String,
        region: String
    },
    description: String,
    placename: String,
    artists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Artist' }],
    rating: Number
});

module.exports = mongoose.model('Event', EventSchema);
