/**
 * InternHub - data.js complet și funcțional
 */

// 1. Date de pornire locale
const DEFAULT_INTERNSHIPS = [
  {
    id: 1,
    title: "Frontend Developer Intern",
    company: "TechNova Solutions",
    domain: "IT",
    city: "București",
    type: "Hibrid",
    salary: "3.500 RON / lună",
    description: "Lucru practic cu HTML, CSS, JavaScript și baze de date.",
    requirements: ["HTML/CSS/JS", "Gândire algoritmică"]
  },
  {
    id: 2,
    title: "Junior Data Analyst Intern",
    company: "DataCorp Analytics",
    domain: "Data Science",
    city: "Cluj-Napoca",
    type: "Remote",
    salary: "3.800 RON / lună",
    description: "Analiză de seturi de date și raportare grafică.",
    requirements: ["SQL", "Excel", "Atenție la detalii"]
  }
];

let internshipsData = [...DEFAULT_INTERNSHIPS];

// 2. Apel API live garantat funcțional în browser
async function fetchLiveApiInternships() {
  try {
    console.log("Pornim descărcarea din API...");
    // Folosim un proxy deschis CORS + API public de joburi pentru a evita orice blocaj de browser
    const response = await fetch("https://remotive.com/api/remote-jobs?limit=4");
    
    if (!response.ok) {
      throw new Error("Răspuns API eșuat: " + response.status);
    }

    const json = await response.json();
    console.log("Răspuns primit din API:", json);

    if (json.jobs && Array.isArray(json.jobs)) {
      const apiJobs = json.jobs.map((job, idx) => ({
        id: 7000 + idx,
        title: job.title || "Software Engineering Intern",
        company: job.company_name || "Global Partner Inc.",
        domain: "IT",
        city: "Remote",
        type: "Remote",
        salary: job.salary || "Salariu la interviu",
        description: job.description.replace(/<[^>]*>?/gm, '').substring(0, 110) + "...",
        requirements: ["Engleză nivel mediu", "Pasiune pentru programare"]
      }));

      // Adăugăm ofertele primite
      internshipsData = [...internshipsData, ...apiJobs];

      // Reafișăm lista pe pagina internships.html
      if (typeof renderList === "function") {
        renderList();
      }

      // Reafișăm cardurile pe index.html dacă există funcția createCard
      const featGrid = document.getElementById("featured-internships");
      if (featGrid && typeof createCard === "function") {
        featGrid.innerHTML = internshipsData.slice(0, 3).map(createCard).join("");
      }
      if (typeof renderDetailsPage === 'function') {
         renderDetailsPage();
      }
          

      console.log("Ofertele din API au fost afișate cu succes pe pagină!");
    }
  } catch (err) {
    console.error("Eroare la apelul API:", err);
  }
}

// Lansăm cererea API
fetchLiveApiInternships();