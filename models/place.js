const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const placeSchema = new Schema({
    title: String,
    description: String,
    price: String,
    location: String,
});

module.exports = mongoose.model('Place', placeSchema);