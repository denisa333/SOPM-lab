
const form = document.getElementById("search-form");
const search = document.getElementById("search");
const cards = document.querySelectorAll(".job-card");
const noResults = document.getElementById("no-results");

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const query = search.value.trim().toLowerCase();
    let found = 0;

    cards.forEach(function(card) {
        const matches = card.textContent.toLowerCase().includes(query);

        card.hidden = !matches;

        if (matches) {
            found++;
        }
    });

    noResults.hidden = found > 0;
});
