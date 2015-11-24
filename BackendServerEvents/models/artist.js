var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArtistSchema = new Schema({
    artistname: {type: String,  required: true},
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' }
});

module.exports = mongoose.model('Artist', ArtistSchema);