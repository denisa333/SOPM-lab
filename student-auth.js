/**
 * 
 */

// Chei localStorage
const STORAGE_CURRENT_STUDENT = 'internhub_current_student';
const STORAGE_APPLICATIONS = 'internhub_applications';

// Inițializare cont demo dacă nu există
(function initDemoStudent() {
  if (!localStorage.getItem(STORAGE_CURRENT_STUDENT)) {
    const demoStudent = {
      id: 101,
      firstName: "Alexandru",
      lastName: "Popescu",
      email: "alexandru.popescu@student.unitbv.ro",
      phone: "0722123456",
      university: "Universitatea Transilvania din Brașov",
      faculty: "Matematică și Informatică",
      studyYear: "Anul III",
      bio: "Pasionat de dezvolatare web, arhitecturi de date și tehnologii moderne cloud. Caut o oportunitate de practică unde pot aplica cunoștințele de JavaScript și Python.",
      skills: ["JavaScript", "HTML/CSS", "Git", "React", "SQL"],
      cvName: "CV_Alexandru_Popescu.pdf"
    };
    localStorage.setItem(STORAGE_CURRENT_STUDENT, JSON.stringify(demoStudent));
  }

  if (!localStorage.getItem(STORAGE_APPLICATIONS)) {
    const demoApplications = [
      {
        id: 1,
        internshipId: 1,
        internshipTitle: "Frontend Developer Intern",
        company: "TechNova Solutions",
        appliedAt: "2026-03-15",
        status: "În evaluare",
        coverLetter: "Sunt foarte entuziasmat de această poziție deoarece am lucrat intensiv cu HTML, CSS și JS în cadrul proiectelor de la facultate."
      },
      {
        id: 2,
        internshipId: 2,
        internshipTitle: "Junior Data Analyst",
        company: "DataCorp Analytics",
        appliedAt: "2026-03-20",
        status: "Acceptat",
        coverLetter: "Am o pasiune deosebită pentru analiza datelor și baze de date SQL."
      }
    ];
    localStorage.setItem(STORAGE_APPLICATIONS, JSON.stringify(demoApplications));
  }
})();

// Helper-e de stocare
function getCurrentStudent() {
  return JSON.parse(localStorage.getItem(STORAGE_CURRENT_STUDENT)) || null;
}

function setCurrentStudent(studentData) {
  if (studentData) {
    localStorage.setItem(STORAGE_CURRENT_STUDENT, JSON.stringify(studentData));
  } else {
    localStorage.removeItem(STORAGE_CURRENT_STUDENT);
  }
}

function getApplications() {
  return JSON.parse(localStorage.getItem(STORAGE_APPLICATIONS)) || [];
}

function saveApplication(appData) {
  const apps = getApplications();
  apps.push(appData);
  localStorage.setItem(STORAGE_APPLICATIONS, JSON.stringify(apps));
}

function logoutStudent() {
  setCurrentStudent(null);
  window.location.href = 'login.html';
}

// Actualizare dinamică a barei de navigație (Navbar)
function updateNavbar() {
  const navLinks = document.querySelector('.nav-links');
  if (!navLinks) return;

  const currentStudent = getCurrentStudent();

  // Curățăm elementele dinamice de cont adăugate anterior (dacă există)
  const existingAuthItems = navLinks.querySelectorAll('.auth-nav-item');
  existingAuthItems.forEach(el => el.remove());

  if (currentStudent) {
    // Dacă studentul este logat
    const applicationsLi = document.createElement('li');
    applicationsLi.className = 'auth-nav-item';
    applicationsLi.innerHTML = `<a href="my-applications.html" class="${window.location.pathname.includes('my-applications.html') ? 'active' : ''}">Aplicațiile mele</a>`;

    const profileLi = document.createElement('li');
    profileLi.className = 'auth-nav-item';
    profileLi.innerHTML = `<a href="profile.html" class="${window.location.pathname.includes('profile.html') ? 'active' : ''}">👤 ${currentStudent.firstName}</a>`;

    const logoutLi = document.createElement('li');
    logoutLi.className = 'auth-nav-item';
    logoutLi.innerHTML = `<a href="#" id="logout-btn" style="color: #ef4444;">Deconectare</a>`;

    navLinks.appendChild(applicationsLi);
    navLinks.appendChild(profileLi);
    navLinks.appendChild(logoutLi);

    document.getElementById('logout-btn')?.addEventListener('click', (e) => {
      e.preventDefault();
      logoutStudent();
    });
  } else {
    // Dacă studentul NU este logat
    const loginLi = document.createElement('li');
    loginLi.className = 'auth-nav-item';
    loginLi.innerHTML = `<a href="login.html" class="btn btn-secondary" style="padding: 0.4rem 0.9rem; font-size: 0.9rem; color: white;">Autentificare / Înregistrare</a>`;
    navLinks.appendChild(loginLi);
  }
}

document.addEventListener('DOMContentLoaded', updateNavbar);