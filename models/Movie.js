const mongoose = require('mongoose');



const ReviewSchema = new mongoose.Schema({
  user: { type: String, required: true },
  comment: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const MovieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  director: { type: String, required: true },
  year: { type: Number, required: true },
  genre: { type: String, required: true },
  rating: { type: Number, required: true },
  
  reviews: { type: [ReviewSchema], default: [] }
}, { versionKey: false,  collection: 'movies' });


module.exports = mongoose.model('Movie', MovieSchema);