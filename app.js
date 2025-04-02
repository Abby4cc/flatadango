document.addEventListener("DOMContentLoaded", () => {
    const filmsList = document.getElementById("films");
    const poster = document.getElementById("poster");
    const title = document.getElementById("title");
    const runtime = document.getElementById("runtime");
    const description = document.getElementById("description");
    const showtime = document.getElementById("showtime");
    const availableTickets = document.getElementById("available-tickets");
    const buyTicketBtn = document.getElementById("buy-ticket");

    function fetchMovies() {
        fetch("http://localhost:3000/films")
            .then(response => response.json())
            .then(movies => {
                filmsList.innerHTML = "";
                movies.forEach(movie => {
                    const listItem = document.createElement("li");
                    listItem.textContent = movie.title;
                    listItem.classList.add("film", "item");
                    listItem.addEventListener("click", () => displayMovieDetails(movie));
                    filmsList.appendChild(listItem);
                });
                if (movies.length > 0) {
                    displayMovieDetails(movies[0]);
                }
            });
    }

    function displayMovieDetails(movie) {
        poster.src = movie.poster;
        title.textContent = movie.title;
        runtime.textContent = movie.runtime;
        description.textContent = movie.description;
        showtime.textContent = movie.showtime;
        updateAvailableTickets(movie);
        buyTicketBtn.onclick = () => buyTicket(movie);
    }

    function updateAvailableTickets(movie) {
        const remainingTickets = movie.capacity - movie.tickets_sold;
        availableTickets.textContent = remainingTickets;
        buyTicketBtn.textContent = remainingTickets > 0 ? "Buy Ticket" : "Sold Out";
        buyTicketBtn.disabled = remainingTickets <= 0;
    }

    function buyTicket(movie) {
        if (movie.capacity - movie.tickets_sold > 0) {
            movie.tickets_sold++;
            fetch(`http://localhost:3000/films/${movie.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tickets_sold: movie.tickets_sold })
            })
            .then(() => updateAvailableTickets(movie));
        }
    }

    fetchMovies();
});
