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

//fetch movie details for modal

async function fetchMovieDetails(movieId) {
    try {
        const response = await fetch(
            `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits`
        );
        const movie = await response.json();
        showMovieModal(movie);
    } catch (error) {
        console.error('Error fetching movie details:', error);
    }
}

// 5. Show Movie Detaiils Modal
function showMovieModal(movie) {
    const directors = movie.credits.crew.filter(person => person.job === 'Director');
    const topCast = movie.credits.cast.slice(0, 5);
    
    modalBody.innerHTML = `
        <div class="modal-layout">
            <div class="modal-poster">
                <img src="${IMG_BASE_URL + movie.poster_path}" alt="${movie.title}" class="modal-img">
            </div>
            <div class="modal-details">
                <h2>${movie.title} <span class="year">(${movie.release_date?.substring(0, 4) || 'N/A'})</span></h2>
                
                <div class="rating-genre">
                    <span class="modal-rating">
                        <i class="fas fa-star"></i> ${movie.vote_average?.toFixed(1) || 'N/A'}/10
                    </span>
                    <span class="runtime">${movie.runtime || 'N/A'} min</span>
                    <span class="genres">${movie.genres?.map(g => g.name).join(', ') || 'N/A'}</span>
                </div>
                
                <h3>Overview</h3>
                <p class="overview">${movie.overview || 'No overview available.'}</p>
                
                ${directors.length > 0 ? `
                    <h3>Director${directors.length > 1 ? 's' : ''}</h3>
                    <p>${directors.map(d => d.name).join(', ')}</p>
                ` : ''}
                
                ${topCast.length > 0 ? `
                    <h3>Top Cast</h3>
                    <p>${topCast.map(actor => actor.name).join(', ')}</p>
                ` : ''}
                
                <button class="favorite-btn" onclick="toggleFavorite(${movie.id})">
                    <i class="far fa-heart"></i> Add to Favorites
                </button>
            </div>
        </div>
    `;
    
    movieModal.style.display = 'block';
    
    // Add CSS for modal layout (add to your style.css)
    if (!document.querySelector('#modal-styles')) {
        const modalStyles = document.createElement('style');
        modalStyles.id = 'modal-styles';
        modalStyles.textContent = `
            .modal-layout {
                display: grid;
                grid-template-columns: 300px 1fr;
                gap: 30px;
            }
            .modal-img {
                width: 100%;
                border-radius: 10px;
                box-shadow: 0 10px 20px rgba(0,0,0,0.3);
            }
            .modal-details h2 {
                font-size: 2rem;
                margin-bottom: 15px;
                color: #00d4ff;
            }
            .year {
                color: #aaa;
                font-weight: normal;
            }
            .rating-genre {
                display: flex;
                gap: 20px;
                margin-bottom: 20px;
                flex-wrap: wrap;
            }
            .modal-rating {
                color: #ffd700;
                font-weight: bold;
            }
            .overview {
                line-height: 1.6;
                margin-bottom: 20px;
                color: #ccc;
            }
            .favorite-btn {
                background: #e74c3c;
                color: white;
                border: none;
                padding: 12px 25px;
                border-radius: 50px;
                cursor: pointer;
                font-size: 1rem;
                margin-top: 20px;
                transition: background 0.3s;
            }
            .favorite-btn:hover {
                background: #c0392b;
            }
            @media (max-width: 768px) {
                .modal-layout {
                    grid-template-columns: 1fr;
                }
                .modal-poster {
                    text-align: center;
                }
                .modal-img {
                    max-width: 250px;
                }
            }
        `;
        document.head.appendChild(modalStyles);
    }
}