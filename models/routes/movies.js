const express = require('express');
const Movie = require('../models/Movie');


const router = express.Router();


router.post('/', async (req, res) => {
try {
const movie = new Movie(req.body);
const savedMovie = await movie.save();
res.status(201).json(savedMovie);
} catch (err) {
res.status(400).json({ error: err.message });
}
});


router.get('/', async (req, res) => {
try {
const movies = await Movie.find();
res.status(200).json(movies);
} catch (err) {
res.status(500).json({ error: err.message });
}
});


router.get('/:id', async (req, res) => {
try {
const movie = await Movie.findById(req.params.id);
if (!movie) return res.status(404).json({ message: 'Movie not found' });
res.status(200).json(movie);
} catch (err) {
res.status(500).json({ error: err.message });
}
});


router.put('/:id', async (req, res) => {
try {
const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
if (!updatedMovie) return res.status(404).json({ message: 'Movie not found' });
res.status(200).json(updatedMovie);
} catch (err) {
res.status(400).json({ error: err.message });
}
});


router.delete('/:id', async (req, res) => {
try {
const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
if (!deletedMovie) return res.status(404).json({ message: 'Movie not found' });
res.status(200).json({ message: 'Movie deleted' });
} catch (err) {
res.status(500).json({ error: err.message });
}
});


router.delete('/', async (req, res) => {
try {
await Movie.deleteMany();
res.status(200).json({ message: 'All movies deleted' });
} catch (err) {
res.status(500).json({ error: 'Failed to delete movies' });
}
});


module.exports = router;