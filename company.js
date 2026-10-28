(() => {
  "use strict";

  const STORAGE = {
    profile: "internhub_company_profile",
    offers: "internhub_company_offers",
    applications: "internhub_applications"
  };

  const readJSON = (key, fallback) => {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch (error) {
      console.warn(`Nu s-au putut citi datele ${key}:`, error);
      return fallback;
    }
  };
  const writeJSON = (key, value) => localStorage.setItem(key, JSON.stringify(value));
  const escapeHTML = (value = "") => String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
  const getManagedOffers = () => readJSON(STORAGE.offers, []);
  const getApplications = () => readJSON(STORAGE.applications, []);
  const getAllOffers = () => {
    const sample = Array.isArray(window.internshipsData) ? window.internshipsData : [];
    return [...sample, ...getManagedOffers()];
  };

  // Profilul companiei
  const profileForm = document.getElementById("company-profile-form");
  if (profileForm) {
    const profile = readJSON(STORAGE.profile, {});
    ["name", "description", "city", "website", "email"].forEach(key => {
      const input = document.getElementById(`company-${key}`);
      if (input) input.value = profile[key] || "";
    });
    profileForm.addEventListener("submit", event => {
      event.preventDefault();
      const data = {
        name: document.getElementById("company-name").value.trim(),
        description: document.getElementById("company-description").value.trim(),
        city: document.getElementById("company-city").value.trim(),
        website: document.getElementById("company-website").value.trim(),
        email: document.getElementById("company-email").value.trim()
      };
      writeJSON(STORAGE.profile, data);
      document.getElementById("profile-message").textContent = "Profilul a fost salvat în acest browser.";
    });
  }

  // Panoul de administrare a ofertelor și candidaților
  const form = document.getElementById("internship-form");
  if (!form) return;

  const byId = id => document.getElementById(id);
  const managedOffers = getManagedOffers;
  const renderOffers = () => {
    const offers = managedOffers();
    const container = byId("company-offers");
    byId("stat-offers").textContent = offers.length;
    byId("stat-active").textContent = offers.filter(offer => offer.active !== false).length;
    byId("stat-candidates").textContent = getApplications().filter(app => offers.some(offer => String(offer.id) === String(app.internshipId))).length;

    if (!offers.length) {
      container.innerHTML = '<p class="empty-state">Nu ai publicat încă oferte. Completează formularul de mai sus pentru a adăuga prima ofertă.</p>';
      return;
    }
    container.innerHTML = offers.map(offer => `
      <article class="offer-row">
        <div>
          <h3>${escapeHTML(offer.title)}</h3>
          <p class="offer-meta">${escapeHTML(offer.domain)} · ${escapeHTML(offer.city)} · ${escapeHTML(offer.type)} · ${escapeHTML(offer.salary || "Salariu nespecificat")}</p>
          <p>${escapeHTML(offer.description).slice(0, 180)}${String(offer.description || "").length > 180 ? "…" : ""}</p>
          ${offer.deadline ? `<p class="offer-meta">Termen-limită: ${escapeHTML(offer.deadline)}</p>` : ""}
        </div>
        <div class="offer-actions">
          <button type="button" data-edit="${escapeHTML(offer.id)}">Editează</button>
          <button type="button" class="delete-offer" data-delete="${escapeHTML(offer.id)}">Șterge</button>
        </div>
      </article>`).join("");

    container.querySelectorAll("[data-edit]").forEach(button => button.addEventListener("click", () => startEdit(button.dataset.edit)));
    container.querySelectorAll("[data-delete]").forEach(button => button.addEventListener("click", () => deleteOffer(button.dataset.delete)));
  };

  const resetForm = () => {
    form.reset();
    byId("edit-id").value = "";
    byId("form-title").textContent = "Publică o ofertă nouă";
    byId("save-offer").textContent = "Publică oferta";
    byId("cancel-edit").hidden = true;
  };

  const startEdit = id => {
    const offer = managedOffers().find(item => String(item.id) === String(id));
    if (!offer) return;
    byId("edit-id").value = offer.id;
    byId("offer-title").value = offer.title || "";
    byId("offer-domain").value = offer.domain || "";
    byId("offer-city").value = offer.city || "";
    byId("offer-type").value = offer.type || "";
    byId("offer-salary").value = offer.salary || "";
    byId("offer-description").value = offer.description || "";
    byId("offer-requirements").value = (offer.requirements || []).join(", ");
    byId("offer-deadline").value = offer.deadline || "";
    byId("form-title").textContent = "Editează oferta";
    byId("save-offer").textContent = "Salvează modificările";
    byId("cancel-edit").hidden = false;
    byId("form-message").textContent = "";
    form.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const deleteOffer = id => {
    const offer = managedOffers().find(item => String(item.id) === String(id));
    if (!offer || !confirm(`Sigur dorești să ștergi oferta „${offer.title}”?`)) return;
    writeJSON(STORAGE.offers, managedOffers().filter(item => String(item.id) !== String(id)));
    renderOffers();
    renderCandidates();
    if (String(byId("edit-id").value) === String(id)) resetForm();
  };

  form.addEventListener("submit", event => {
    event.preventDefault();
    const current = managedOffers();
    const editId = byId("edit-id").value;
    const profile = readJSON(STORAGE.profile, {});
    const offer = {
      id: editId ? Number(editId) : Date.now(),
      title: byId("offer-title").value.trim(),
      company: profile.name || "Compania mea",
      companyId: "current-company",
      domain: byId("offer-domain").value,
      city: byId("offer-city").value.trim(),
      type: byId("offer-type").value,
      salary: byId("offer-salary").value.trim() || "Nespecificat",
      description: byId("offer-description").value.trim(),
      requirements: byId("offer-requirements").value.split(",").map(item => item.trim()).filter(Boolean),
      deadline: byId("offer-deadline").value,
      active: true
    };
    if (editId) {
      writeJSON(STORAGE.offers, current.map(item => String(item.id) === String(editId) ? offer : item));
      byId("form-message").textContent = "Modificările au fost salvate.";
    } else {
      current.push(offer);
      writeJSON(STORAGE.offers, current);
      byId("form-message").textContent = "Oferta a fost publicată.";
    }
    resetForm();
    renderOffers();
    renderCandidates();
    byId("form-message").textContent = editId ? "Modificările au fost salvate." : "Oferta a fost publicată.";
  });
  byId("cancel-edit").addEventListener("click", resetForm);

  const renderCandidates = () => {
    const container = byId("company-candidates");
    const offers = managedOffers();
    const apps = getApplications().filter(app => offers.some(offer => String(offer.id) === String(app.internshipId)));
    if (!apps.length) {
      container.innerHTML = '<p class="empty-state">Nu există încă aplicații pentru ofertele tale. Când partea studentului salvează aplicațiile în localStorage cu cheia <code>internhub_applications</code>, acestea vor apărea aici.</p>';
      return;
    }
    container.innerHTML = `<div class="candidate-table-wrap"><table class="candidate-table">
      <thead><tr><th>Student</th><th>Email</th><th>Internship</th><th>Data aplicării</th><th>Status</th></tr></thead>
      <tbody>${apps.map(app => {
        const offer = offers.find(item => String(item.id) === String(app.internshipId));
        return `<tr>
          <td>${escapeHTML(app.studentName || app.name || "Student")}</td>
          <td>${escapeHTML(app.email || "—")}</td>
          <td>${escapeHTML(offer?.title || app.internshipTitle || "Ofertă")}</td>
          <td>${escapeHTML(app.appliedAt || app.applied_at || "—")}</td>
          <td><select data-status-id="${escapeHTML(app.id ?? `${app.studentId}-${app.internshipId}`)}" aria-label="Status candidat">
            ${["În așteptare", "În evaluare", "Acceptat", "Respins"].map(status => `<option ${((app.status || "În așteptare") === status) ? "selected" : ""}>${status}</option>`).join("")}
          </select></td>
        </tr>`;
      }).join("")}</tbody></table></div>`;
    container.querySelectorAll("[data-status-id]").forEach(select => select.addEventListener("change", () => {
      const allApps = getApplications();
      const rowIndex = apps.findIndex(app => String(app.id ?? `${app.studentId}-${app.internshipId}`) === select.dataset.statusId);
      if (rowIndex < 0) return;
      const target = apps[rowIndex];
      const index = allApps.findIndex(app => String(app.id ?? `${app.studentId}-${app.internshipId}`) === String(target.id ?? `${target.studentId}-${target.internshipId}`));
      if (index >= 0) {
        allApps[index].status = select.value;
        writeJSON(STORAGE.applications, allApps);
      }
    }));
  };

  renderOffers();
  renderCandidates();
})();
