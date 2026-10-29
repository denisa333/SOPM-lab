/**
 * 
 */

document.addEventListener('DOMContentLoaded', function() {
  const detailsContainer = document.getElementById('internship-details-container');
  if (!detailsContainer) return;

  // Interceptăm butonul generat de Persoana 1
  const observer = new MutationObserver(function() {
    const applyBox = detailsContainer.querySelector('.detail-card div[style*="border-top"]');
    if (applyBox) {
      observer.disconnect();
      setupApplyButton(applyBox);
    }
  });

  observer.observe(detailsContainer, { childList: true, subtree: true });
});

function setupApplyButton(applyBox) {
  const params = new URLSearchParams(window.location.search);
  const internshipId = parseInt(params.get("id"));
  const item = typeof internshipsData !== 'undefined' ? internshipsData.find(x => x.id === internshipId) : null;

  if (!item) return;

  const currentStudent = getCurrentStudent();
  const applications = getApplications();
  const hasApplied = applications.some(app => app.internshipId === internshipId);

  if (hasApplied) {
    applyBox.innerHTML = `
      <div style="background-color: #d1fae5; border: 1px solid #10b981; border-radius: 8px; padding: 1rem; text-align: center; color: #065f46; font-weight: 600;">
        ✓ Ai aplicat deja la acest internship! Statusul aplicației tale este vizibil în secțiunea "Aplicațiile mele".
      </div>
    `;
  } else {
    applyBox.innerHTML = `
      <button id="trigger-apply-btn" class="btn btn-secondary">Aplică acum la acest internship</button>
    `;

    document.getElementById('trigger-apply-btn').addEventListener('click', function() {
      if (!currentStudent) {
        alert('Trebuie să fii autentificat ca student pentru a aplica!');
        window.location.href = 'login.html';
        return;
      }
      openApplyModal(item, currentStudent);
    });
  }
}

function openApplyModal(internship, student) {
  let modal = document.getElementById('apply-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'apply-modal';
    modal.className = 'modal';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3>Aplicație: ${internship.title}</h3>
        <button class="close-modal" onclick="closeApplyModal()">&times;</button>
      </div>
      <p style="color: var(--muted-text); margin-bottom: 1rem;">Compania: <strong>${internship.company}</strong></p>

      <form id="apply-form">
        <div class="form-group">
          <label>Candidat</label>
          <input type="text" value="${student.firstName} ${student.lastName} (${student.email})" disabled style="background-color: #f1f5f9;">
        </div>

        <div class="form-group">
          <label>CV Atașat</label>
          <input type="text" value="${student.cvName || 'CV_Incarcat.pdf'}" disabled style="background-color: #f1f5f9;">
        </div>

        <div class="form-group">
          <label for="apply-cover-letter">Scrisoare de intenție / Mesaj pentru companie</label>
          <textarea id="apply-cover-letter" rows="4" placeholder="Explică pe scurt de ce dorești să participi la acest internship..."></textarea>
        </div>

        <div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1.5rem;">
          <button type="button" class="btn btn-secondary" onclick="closeApplyModal()" style="background-color: #94a3b8;">Anulează</button>
          <button type="submit" class="btn">Trimite Aplicația</button>
        </div>
      </form>
    </div>
  `;

  modal.classList.remove('hidden');

  document.getElementById('apply-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const coverLetter = document.getElementById('apply-cover-letter').value;

    const newApp = {
      id: Date.now(),
      internshipId: internship.id,
      internshipTitle: internship.title,
      company: internship.company,
      appliedAt: new Date().toISOString().split('T')[0],
      status: 'În evaluare',
      coverLetter: coverLetter
    };

    saveApplication(newApp);
    closeApplyModal();
    alert('Aplicația ta a fost trimisă cu succes!');
    window.location.reload();
  });
}

function closeApplyModal() {
  const modal = document.getElementById('apply-modal');
  if (modal) {
    modal.classList.add('hidden');
  }
}