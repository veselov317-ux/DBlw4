const express = require('express');
const Movie = require('../models/Movie');


const router = express.Router();


// GET /movies
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find({}); // теперь точно работает
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /movies
router.post('/', async (req, res) => {
  try {
    const newMovie = new Movie(req.body);
    await newMovie.save();
    res.status(201).json(newMovie);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
router.delete('/', async (req, res) => {
  try {
    await Movie.deleteMany({});
    res.json({ message: 'All movies deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get('/director/:name', async (req, res) => {
  try {
    const directorName = req.params.name;
    const movies = await Movie.find({ director: directorName });
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/count-by-year', async (req, res) => {
  try {
    const result = await Movie.aggregate([
      { 
        $group: { 
          _id: "$year", 
          count: { $sum: 1 } 
        } 
      },
      { $sort: { _id: 1 } } 
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;