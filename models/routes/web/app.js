const API_URL = '/movies';
let editingMovieId = null;


async function loadMovies() {
const response = await fetch(API_URL);
const movies = await response.json();
const moviesList = document.getElementById('movies-list');
moviesList.innerHTML = '';


movies.forEach(movie => {
const div = document.createElement('div');
div.innerHTML = `${movie.title} (${movie.year})`;
moviesList.appendChild(div);
});
}


loadMovies();