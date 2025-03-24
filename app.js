document.addEventListener('DOMContentLoaded', () => {
    fetchFirstMovie();
    fetchAllMovies();
});

function fetchFirstMovie() {
    fetch('http://localhost:3000/films/1')
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

    buyTicketButton.onclick = () => {
        if (availableTickets > 0) {
            buyTicket(movie.id, availableTickets);
        }
    };
}

function displayMoviesList(movies) {
    const filmsList = document.getElementById('films');
    filmsList.innerHTML = '';
    movies.forEach(movie => {
        const li = document.createElement('li');
        li.className = 'film item';
        li.innerText = movie.title;

        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete';
        deleteButton.onclick = () => deleteFilm(movie.id);
        li.appendChild(deleteButton);

        filmsList.appendChild(li);
    });
}

function buyTicket(movieId, availableTickets) {
    fetch(`http://localhost:3000/films/${movieId}`)
        .then(response => response.json())
        .then(movie => {
            const newTicketsSold = movie.tickets_sold + 1;

            fetch(`http://localhost:3000/films/${movieId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ tickets_sold: newTicketsSold })
            })
            .then(response => response.json())
            .then(updatedMovie => {
                displayMovieDetails(updatedMovie);
                fetchAllMovies();
            });
        });
}

function deleteFilm(movieId) {
    fetch(`http://localhost:3000/films/${movieId}`, {
        method: 'DELETE'
    })
    .then(() => {
        fetchAllMovies();
    });
}