const express = require('express');
const Movie = require('../models/Movie');


const router = express.Router();



router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find({}); 
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


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

router.post('/:id/reviews', async (req, res) => {
  const { user, comment } = req.body;

  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });

    movie.reviews.push({ user, comment });
    await movie.save();

    res.status(201).json({
      message: 'Review added',
      review: movie.reviews[movie.reviews.length - 1]
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


router.get('/:id/reviews', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });

    res.json(movie.reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Movie not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Movie.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Movie not found' });
    res.json({ message: 'Movie deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;