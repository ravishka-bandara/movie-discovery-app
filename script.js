const API_KEY = '77640f8c58e70b3e2b148b414e1d7952';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// dom elements

const moviesGrid = document.getElementById('moviesGrid');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const sectionTitle = document.getElementById('sectionTitle');
const movieModal = document.getElementById('movieModal');
const modalBody = document.getElementById('modalBody');
const closeBtn = document.getElementById('.close');

// initialization

let currentPage = 1;
let isSearching = false;
let currentSearchTerm = '';

// load popular muvies when page loads

document.addEventListener('DOMContentLoaded', () =>{
    fetchPopularMovies();

    //event listners
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) =>{
        if (e.key === 'enter')performSearch();
    });

    closeBtn.addEventListener('click', () =>{
        movieModal.style.display = 'none';
    });

    //close modal when click outside
    window.addEventListener('click', (e) =>{
        if (e.target === movieModal){
            movieModal.style.display = 'none';
        }
    });
    
});

// fetch populer movies
async function fetchPopularMovies() {
    try{
        const response = await fetch(
            `{$BASE_URL}/movie/popular?api_key=${API_KEY}&page=${currentPage}`
        );
        const data = await response.json();
        displayMovies(data.results);
        sectionTitle.textContent = 'Popular Movies';
    } catch (error){
        console.error('Error fetching popular movies:', error);
        moviesGrid.innerHTML = '<p class="error">Failed to load movies. please try again.</p>';
    }
}

// search movies 

async function searchMovies(query, page = 1) {
    try{
        const response = await fetch(
            `{$BASE_URL}/search/movie?api-key=${API_KEY}&query=${query}&page=${page}`
        );
        const data = await response.json();
        displayMovies(data.results);
        sectionTitle.textContent = `search result for "${query}"`;
        currentSearchTerm = query;
        isSearching = true;
    } catch (error){
        console.error('error searching movies:', error);
    }
}

function performSearch(){
    const query = searchInput.ariaValueMax.trim();
    if(query){
        searchMovies(query);
    }else{
        // when serch empty show popular movies
        isSearching = false;
        fetchPopularMovies();
    }
}

// display movies in grid

function displayMovies(movies){
    if(movies.length === 0){
        moviesGrid.innerHTML = `<p class="no-results"> No movies found. try again with different search.</p>`;
        return;
    }

    moviesGrid.innerHTML = movies.map(movie =>`
        <div class="movie-card" data-id="${movie.id}>
        <img
            src="${movie.poster_path ? IMG_BASE_URL + movie.poster_path : 'https://via.placeholder.com/200x300?text=No+Poster'}"
            alt="${movie.title}"
            class"movie-poster"
            loading="lazy"
            >

            <div class="movie-info">
                <h3 class="movie-title" title="${movie.title}">${movie.title}</h3>
                <p class="movie-year">${movie.release_date ? movie.release_date.substring(0, 4) : 'N/A'}</p>
                <p class="movie-rating">
                    <i class="fas fa-star"></i> ${movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                </p>
            </div>
        </div>
    `).join('');

    // Add click event to each cardd
    document.querySelectorAll('.movie-card').forEach(card => {
        card.addEventListener('click', () => {
            const movieId = card.getAttribute('data-id');
            fetchMovieDetails(movieId);
        });
    });
}