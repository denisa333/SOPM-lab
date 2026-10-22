// Funcție generatoare de card HTML
function createCard(item) {
  return `
    <div class="internship-card">
      <div>
        <h3>${item.title}</h3>
        <p class="card-company">${item.company}</p>
        <div class="card-tags">
          <span class="tag tag-domain">${item.domain}</span>
          <span class="tag tag-city">${item.city}</span>
        </div>
        <p style="color: var(--muted-text); font-size: 0.9rem; margin-top: 0.5rem;">${item.description.substring(0, 95)}...</p>
      </div>
      <div style="margin-top: 1.5rem;">
        <a href="details.html?id=${item.id}" class="btn" style="width: 100%; text-align: center;">Vezi detalii</a>
      </div>
    </div>
  `;
}

// 1. Pagina Home (index.html) - Afișare primele 3 oferte
const featuredContainer = document.getElementById("featured-internships");
if (featuredContainer) {
  const featured = internshipsData.slice(0, 3);
  featuredContainer.innerHTML = featured.map(createCard).join("");
}

// 2. Pagina Toate Ofertele (internships.html) - Filtrare & Căutare
const allContainer = document.getElementById("all-internships");
if (allContainer) {
  const searchInput = document.getElementById("search-input");
  const domainFilter = document.getElementById("domain-filter");
  const cityFilter = document.getElementById("city-filter");

  function renderList() {
    const query = searchInput.value.toLowerCase();
    const selectedDomain = domainFilter.value;
    const selectedCity = cityFilter.value;

    const filtered = internshipsData.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(query) ||
        item.company.toLowerCase().includes(query);
      const matchesDomain = !selectedDomain || item.domain === selectedDomain;
      const matchesCity = !selectedCity || item.city === selectedCity;

      return matchesSearch && matchesDomain && matchesCity;
    });

    if (filtered.length === 0) {
      allContainer.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; color: var(--muted-text); padding: 2rem;">Nu a fost găsit niciun internship conform filtrelor selectate.</p>`;
    } else {
      allContainer.innerHTML = filtered.map(createCard).join("");
    }
  }

  // Event Listeners pentru filtre
  searchInput.addEventListener("input", renderList);
  domainFilter.addEventListener("change", renderList);
  cityFilter.addEventListener("change", renderList);

  // Randare inițială
  renderList();
}

// 3. Pagina Detalii (details.html) - Citire ID din URL
const detailsContainer = document.getElementById("internship-details-container");
if (detailsContainer) {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"));
  const item = internshipsData.find((x) => x.id === id);

  if (item) {
    detailsContainer.innerHTML = `
      <div class="detail-card">
        <div class="detail-header">
          <h2>${item.title}</h2>
          <p class="card-company" style="font-size: 1.15rem; margin-top: 0.25rem;">${item.company}</p>
          <div class="detail-meta">
            <span>📍 Oraș: <strong>${item.city}</strong> (${item.type})</span>
            <span>💼 Domeniu: <strong>${item.domain}</strong></span>
            <span>💰 Salariu: <strong>${item.salary}</strong></span>
          </div>
        </div>

        <h3 style="margin-bottom: 0.5rem;">Descrierea postului</h3>
        <p style="color: var(--muted-text); margin-bottom: 1.5rem;">${item.description}</p>

        <h3 style="margin-bottom: 0.5rem;">Cerințe</h3>
        <ul class="requirements-list">
          ${item.requirements.map(req => `<li>${req}</li>`).join("")}
        </ul>

        <div style="margin-top: 2rem; border-top: 1px solid var(--border-color); padding-top: 1.5rem;">
          <!-- Butonul pregătit pentru Persoana 2 (Autentificare & Aplicare) -->
          <button class="btn btn-secondary" onclick="alert('Funcționalitate rezervată pentru Persoana 2 (Contul studentului)')">Aplică acum</button>
        </div>
      </div>
    `;
  } else {
    detailsContainer.innerHTML = `
      <div class="detail-card" style="text-align: center;">
        <h2>Internship negăsit</h2>
        <p style="color: var(--muted-text); margin: 1rem 0;">Oferta pe care o căutați nu există sau a fost ștearsă.</p>
        <a href="internships.html" class="btn">Vezi toate ofertele</a>
      </div>
    `;
  }
}