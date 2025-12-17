const API_URL = '/movies';
let editingMovieId = null;
// add movies cache
let moviesCache = [];


async function loadMovies() {
  const response = await fetch(API_URL);
  const movies = await response.json();
  
  moviesCache = movies;
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
      <div class="card-actions" style="margin-top:10px;">
        <button type="button" class="view-reviews" data-id="${movie._id}">View Reviews</button>
        <button type="button" class="add-review" data-id="${movie._id}">Add Review</button>
        <button type="button" class="edit-movie" data-id="${movie._id}">Edit</button>
        <button type="button" class="delete-movie" data-id="${movie._id}">Delete</button>
      </div>
    `;
    moviesList.appendChild(div);

    
    const viewBtn = div.querySelector('.view-reviews');
    const addBtn = div.querySelector('.add-review');
    const editBtn = div.querySelector('.edit-movie');
    const deleteBtn = div.querySelector('.delete-movie');

    viewBtn.addEventListener('click', () => {
      const movieId = viewBtn.dataset.id;
      document.getElementById('review-movie-id').value = movieId;
      loadReviews(movieId);
    });

    addBtn.addEventListener('click', () => {
      const movieId = addBtn.dataset.id;
      const movie = moviesCache.find(m => m._id === movieId);
      document.getElementById('review-movie-id').value = movieId;
      const titleEl = document.getElementById('review-title');
      titleEl.textContent = `Add Review for: ${movie ? movie.title : ''}`;
      // focus first input for convenience
      document.getElementById('review-user').focus();
    });

    editBtn.addEventListener('click', () => {
      editingMovieId = editBtn.dataset.id;
      const movieToEdit = moviesCache.find(m => m._id === editingMovieId);
      document.getElementById('title').value = movieToEdit.title || '';
      document.getElementById('director').value = movieToEdit.director || '';
      document.getElementById('year').value = movieToEdit.year || '';
      document.getElementById('genre').value = movieToEdit.genre || '';
      document.getElementById('rating').value = movieToEdit.rating || '';
      document.getElementById('add-button').textContent = 'Update Movie';
      document.getElementById('cancel-edit').style.display = 'inline-block';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    deleteBtn.addEventListener('click', async () => {
      if (!confirm('Are you sure you want to delete this movie?')) return;
      try {
        const response = await fetch(`${API_URL}/${deleteBtn.dataset.id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete movie');
        loadMovies();
      } catch (err) {
        console.error(err);
      }
    });
  });

  
  const selectedId = document.getElementById('review-movie-id').value;
  if (selectedId) loadReviews(selectedId);
}


const form = document.getElementById('movie-form');
const addButton = document.getElementById('add-button');
const cancelBtn = document.getElementById('cancel-edit');

form.addEventListener('submit', async (event) => {
  event.preventDefault(); 

  const movieData = {
    title: document.getElementById('title').value,
    director: document.getElementById('director').value,
    year: Number(document.getElementById('year').value),
    genre: document.getElementById('genre').value,
    rating: Number(document.getElementById('rating').value)
  };

  try {
    let response;
    if (editingMovieId) {
      response = await fetch(`${API_URL}/${editingMovieId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(movieData)
      });
      if (!response.ok) throw new Error('Failed to update movie');
      editingMovieId = null;
      addButton.textContent = 'Add Movie';
      cancelBtn.style.display = 'none';
    } else {
      response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(movieData)
      });
      if (!response.ok) throw new Error('Failed to add movie');
    }

    form.reset(); 
    loadMovies();  
  } catch (err) {
    console.error(err);
  }
});

cancelBtn.addEventListener('click', (e) => {
  editingMovieId = null;
  form.reset();
  addButton.textContent = 'Add Movie';
  cancelBtn.style.display = 'none';
});


const deleteButton = document.getElementById('delete-all');
deleteButton.addEventListener('click', async (event) => {
  event.preventDefault(); 

  if (!confirm('Are you sure you want to delete all movies?')) return;

  try {
    const response = await fetch(API_URL, {
      method: 'DELETE'
    });

    if (!response.ok) throw new Error('Failed to delete movies');

    loadMovies(); 
  } catch (err) {
    console.error(err);
  }
});
const reviewForm = document.getElementById('review-form');
reviewForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const movieId = document.getElementById('review-movie-id').value;
  if (!movieId) {
    alert('Please select a movie to review (use "Add Review" or "View Reviews")');
    return;
  }

  const reviewData = {
    user: document.getElementById('review-user').value,
    comment: document.getElementById('review-comment').value
  };

  try {
    const response = await fetch(`/movies/${movieId}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData)
    });

    if (!response.ok) throw new Error('Failed to add review');

    
    document.getElementById('review-user').value = '';
    document.getElementById('review-comment').value = '';
    
    loadReviews(movieId);
  } catch (err) {
    console.error(err);
  }
});


async function loadReviews(movieId) {
  if (!movieId) return;
  
  const movie = moviesCache.find(m => m._id === movieId);
  const titleEl = document.getElementById('review-title');
  titleEl.textContent = movie ? `Reviews for: ${movie.title}` : 'Reviews';

  try {
    const response = await fetch(`/movies/${movieId}/reviews`);
    if (!response.ok) throw new Error('Failed to load reviews');
    const reviews = await response.json();
    const reviewsList = document.getElementById('reviews-list');
    reviewsList.innerHTML = '';

    if (!reviews || reviews.length === 0) {
      reviewsList.innerHTML = '<p>No reviews yet.</p>';
      return;
    }

    reviews.forEach(r => {
      const div = document.createElement('div');
      div.classList.add('review-card');
      div.innerHTML = `<strong>${r.user}:</strong> ${r.comment}`;
      reviewsList.appendChild(div);
    });
  } catch (err) {
    console.error(err);
  }
}
loadMovies();
