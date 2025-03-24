document.addEventListener('DOMContentLoaded', () => {
    fetchMovieDetails(1);
    fetchAllMovies();
});

function fetchMovieDetails(id) {
    fetch(`http://localhost:3000/films/${id}`)
        .then(response => response.json())
        .then(movie => {
            displayMovieDetails(movie);
        });
}

function fetchAllMovies() {
    fetch('http://localhost:3000/films')
        .then(response => response.json())
        .then(movies => {
            displayMoviesList(movies);
        });
}

function displayMovieDetails(movie) {
    const availableTickets = movie.capacity - movie.tickets_sold;
    document.getElementById('movie-title').innerText = movie.title;
    document.getElementById('movie-poster').src = movie.poster;
    document.getElementById('movie-runtime').innerText = `Runtime: ${movie.runtime} minutes`;
    document.getElementById('movie-showtime').innerText = `Showtime: ${movie.showtime}`;
    document.getElementById('available-tickets').innerText = `Available Tickets: ${availableTickets}`;
    
    const buyTicketButton = document.getElementById('buy-ticket');
    buyTicketButton.disabled = availableTickets <= 0;
    buyTicketButton.innerText = availableTickets > 0 ? 'Buy Ticket' : 'Sold Out';
    buyTicketButton.onclick = () => buyTicket(movie.id, availableTickets);
}