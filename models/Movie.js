const mongoose = require('mongoose');


const MovieSchema = new mongoose.Schema({
title: { type: String, required: true },
director: { type: String, required: true },
year: { type: Number, required: true },
genre: { type: String, required: true },
rating: { type: Number, required: true }
}, { versionKey: false,  collection: 'movies' });


module.exports = mongoose.model('Movie', MovieSchema);