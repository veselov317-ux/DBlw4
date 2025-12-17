const API_URL = '/movies';
let editingMovieId = null;

// Загрузка и отображение фильмов
async function loadMovies() {
  const response = await fetch(API_URL);
  const movies = await response.json();
  const moviesList = document.getElementById('movies-list');
  moviesList.innerHTML = '';

  movies.forEach(movie => {
    const div = document.createElement('div');
    div.classList.add('movie-card');
    div.innerHTML = `
      <h3>${movie.title}</h3>
      <p><strong>Director:</strong> ${movie.director}</p>
      <p><strong>Year:</strong> ${movie.year}</p>
      <p><strong>Genre:</strong> ${movie.genre}</p>
      <p><strong>Rating:</strong> ${movie.rating}</p>
    `;
    moviesList.appendChild(div);
  });
}

// Обработка формы добавления фильма
const form = document.getElementById('movie-form');
form.addEventListener('submit', async (event) => {
  event.preventDefault(); // отменяем перезагрузку страницы

  const movieData = {
    title: document.getElementById('title').value,
    director: document.getElementById('director').value,
    year: Number(document.getElementById('year').value),
    genre: document.getElementById('genre').value,
    rating: Number(document.getElementById('rating').value)
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(movieData)
    });

    if (!response.ok) throw new Error('Failed to add movie');

    form.reset(); // очищаем форму
    loadMovies();  // обновляем список фильмов
  } catch (err) {
    console.error(err);
  }
});

// Обработка кнопки удаления всех фильмов
const deleteButton = document.getElementById('delete-all');
deleteButton.addEventListener('click', async (event) => {
  event.preventDefault(); // чтобы кнопка не перезагружала страницу

  if (!confirm('Are you sure you want to delete all movies?')) return;

  try {
    const response = await fetch(API_URL, {
      method: 'DELETE'
    });

    if (!response.ok) throw new Error('Failed to delete movies');

    loadMovies(); // обновляем список фильмов
  } catch (err) {
    console.error(err);
  }
});

loadMovies();
