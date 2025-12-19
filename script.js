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