
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const studentGrid = document.getElementById("studentGrid");
const alphabetFilter = document.getElementById("alphabetFilter");
const openBtn = document.getElementById('open-add-student-modal');
const modal = document.getElementById('add-student-modal');
const cancelBtn = document.getElementById('cancel-add-student');
const form = document.getElementById('add-student-form');
const studentImageInput = document.getElementById('student-image');
const imagePreview = document.getElementById('image-preview');

let currentYearFilter = "1";

//pag render ng students sa stundent grid
function renderStudents(filter = "") {
  const cards = studentGrid.querySelectorAll(".student-card");

  cards.forEach(card => {
    const name = card.querySelector(".name").textContent.trim().toLowerCase();
    const year = card.getAttribute("data-year");

    const matchesSearch = name.includes(filter.toLowerCase());
    const matchesYear = year === currentYearFilter;

    card.style.display = (matchesSearch && matchesYear) ? "flex" : "none";
  });

  sortStudents();
}

//search sa students
function sortStudents() {
  const order = sortSelect.value.toLowerCase();
  const visibleCards = Array.from(studentGrid.querySelectorAll(".student-card"))
    .filter(card => card.style.display !== "none");

  visibleCards.sort((a, b) => {
    const nameA = a.querySelector(".name").textContent.trim().toLowerCase();
    const nameB = b.querySelector(".name").textContent.trim().toLowerCase();
    return order === "a-z" ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
  });

  visibleCards.forEach(card => studentGrid.appendChild(card));
}

// basta yan yung a to z
function setupAlphabetFilters() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  letters.forEach(letter => {
    const btn = document.createElement("button");
    btn.textContent = letter;
    btn.addEventListener("click", () => {
      searchInput.value = letter;
      renderStudents(letter.toLowerCase());
    });
    alphabetFilter.appendChild(btn);
  });

  const clearBtn = document.createElement("button");
  clearBtn.textContent = "CLEAR ALL";
  clearBtn.addEventListener("click", () => {
    searchInput.value = "";
    renderStudents();
  });
  alphabetFilter.appendChild(clearBtn);
}

//pag filter ng students kada year
document.addEventListener("DOMContentLoaded", () => {
  const yearLinks = document.querySelectorAll(".year-card[data-filter-year]");

  yearLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      currentYearFilter = link.getAttribute("data-filter-year");
      searchInput.value = "";
      renderStudents();
    });
  });

  //pag show ng profile ng student
  document.querySelectorAll('.student-card').forEach(card => {
    card.addEventListener('click', () => {
      const name = card.getAttribute('data-name');
      const avatar = card.getAttribute('data-avatar');
      localStorage.setItem('selectedStudentName', name);
      localStorage.setItem('selectedStudentAvatar', avatar);
    });
  });

  openBtn.addEventListener('click', () => {
    modal.style.display = 'flex';
  });

  cancelBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    form.reset();
  });

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
      form.reset();
    }
  });

  //pag add ng student
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const firstName = document.getElementById("First-name").value.trim();
    const middleName = document.getElementById("Middle-name").value.trim();
    const lastName = document.getElementById("Last-name").value.trim();
    const yearLevel = document.getElementById("year-level").value;

    if (!firstName || !lastName || !yearLevel) return;

    const fullName = `${firstName} ${middleName ? middleName.charAt(0) + '.' : ''} ${lastName}`;

    const card = document.createElement('div');
    card.className = 'student-card';
    card.setAttribute('data-year', yearLevel);
    card.innerHTML = `
      <div class="avatar"></div>
      <div class="name">${fullName}</div>
    `;

    studentGrid.appendChild(card);

    modal.style.display = 'none';
    form.reset();

    if (yearLevel !== currentYearFilter) {
      card.style.display = "none";
    }
  });

  studentImageInput.addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => imagePreview.src = reader.result;
      reader.readAsDataURL(file);
    } else {
      imagePreview.src = "";
    }
  });

  setupAlphabetFilters();
  renderStudents();
});

searchInput.addEventListener("input", () => {
  renderStudents(searchInput.value);
});

sortSelect.addEventListener("change", () => {
  sortStudents();
});


