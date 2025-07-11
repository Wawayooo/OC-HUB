import { setupDeleteModal } from './delete_modal.js';


const officers = [
  { name: 'Mr. John Joshua Arizala Jr.', role: 'President', year_level: '3', image: './assets/media/blank-profile-picture-973460.svg' },
  { name: 'Anna Rose Torres Ayeng', role: 'Vice President', year_level: '3', image: './assets/media/304880020_484105543722963_6792900679710469272_n.png' },
  { name: 'Mark', role: 'Secretary', year_level: '2', image: './assets/media/bdce5c78-8d3a-44d0-8036-0802e6ee59a5.jpg' },
  { name: 'Jill', role: 'Treasurer', year_level: '2', image: './assets/media/bdce5c78-8d3a-44d0-8036-0802e6ee59a5.jpg' },
  { name: 'Tom', role: 'Auditor', year_level: '1', image: './assets/media/bdce5c78-8d3a-44d0-8036-0802e6ee59a5.jpg' },
  { name: 'Lucy', role: 'P.R.O.', year_level: '1', image: './assets/media/bdce5c78-8d3a-44d0-8036-0802e6ee59a5.jpg' },
];

const treeContainer = document.getElementById("tree-container");
const membersContainer = document.getElementById("members-container");

function createOfficerBox({ name, role, year_level, image }, extraClass = "") {
  const div = document.createElement("div");
  div.className = `box ${extraClass}`.trim();
  div.innerHTML = `
    <div class="img-cont">
      <img src="${image}" alt="${name}" />
    </div>
    <div class="info-cont">
      <h4>${name}</h4>
      <p>${role}</p>
      <span>Year ${year_level}</span>
    </div>
  `;
  return div;
}

function renderOfficerTree() {
  treeContainer.innerHTML = "";
  if (!officers.length) return;

  const top = createOfficerBox(officers[0], "first-officer");
  treeContainer.appendChild(top);
  if (officers.length === 1) return;

  const row = document.createElement("div");
  row.className = "tree-row";
  const left = document.createElement("div");
  const right = document.createElement("div");
  left.className = right.className = "tree-column";

  officers.slice(1).forEach((officer, i) => {
    const column = i % 2 === 0 ? left : right;
    column.appendChild(createOfficerBox(officer));
  });

  row.append(left, right);
  treeContainer.appendChild(row);
}

const clubs = [
  "CCSO", "Performance Club", "Programming Club", "Tech Club",
  "Debate Club", "Chess Club", "Science Club", "English Club", "Math Club"
];

const scrollWrapper = document.querySelector(".clubs-scroll-wrapper");
const clubsContainer = document.getElementById("clubsContainer");
const prevBtn = document.querySelector(".prev-club");
const nextBtn = document.querySelector(".next-club");

function renderClubs() {
  clubsContainer.innerHTML = "";
  
  clubs.forEach((club, i) => {
    const btn = document.createElement("button");
    btn.textContent = club;

    if (i === 0) btn.classList.add("active");

    btn.addEventListener("click", () => {
      clubsContainer.querySelectorAll("button").forEach(b => b.classList.remove("active"));

      btn.classList.add("active");
    });

    clubsContainer.appendChild(btn);
  });
}


function updateScrollButtons() {
  const maxScroll = scrollWrapper.scrollWidth - scrollWrapper.clientWidth;
  const scrolled = scrollWrapper.scrollLeft;
  prevBtn.style.display = scrolled > 0 ? "block" : "none";
  nextBtn.style.display = Math.ceil(scrolled) < Math.floor(maxScroll) ? "block" : "none";
}

prevBtn.onclick = () => scrollWrapper.scrollBy({ left: -200, behavior: "smooth" });
nextBtn.onclick = () => scrollWrapper.scrollBy({ left: 200, behavior: "smooth" });
scrollWrapper.onscroll = window.onresize = updateScrollButtons;

function toggleModal(modal, show) {
  modal?.classList.toggle("active", show);
}

function initModalTriggers() {
  const modalPairs = [
    ["open-add-member-modal-btn", "add-member-modal"],
    ["open-manage-club-modal-btn", "manage-clubs-modal"],
    ["open-add-club-modal-btn", "add-club-modal"],
    ["open-add-officer-modal-btn", "add-officer-modal"]
  ];

  modalPairs.forEach(([openId, modalId]) => {
    document.getElementById(openId)?.addEventListener("click", () => toggleModal(document.getElementById(modalId), true));
  });

  const closePairs = [
    "close-add-member-modal",
    "close-manage-clubs-modal",
    "close-add-club-modal",
    "close-manage-officers-modal",
    "close-add-officer-modal"
  ];

  closePairs.forEach(closeId => {
    document.getElementById(closeId)?.addEventListener("click", () => {
      const modalId = closeId.replace("close-", "");
      toggleModal(document.getElementById(modalId), false);
    });
  });

  document.querySelectorAll(".view-officer-btn").forEach(btn => {
    btn.addEventListener("click", () => toggleModal(document.getElementById("manage-officers-modal"), true));
  });

  document.querySelectorAll(".edit-club-btn").forEach(btn => {
    btn.addEventListener("click", () => toggleModal(document.getElementById("add-club-modal"), true));
  });

  document.querySelectorAll(".edit-officer-btn").forEach(btn => {
    btn.addEventListener("click", () => toggleModal(document.getElementById("add-officer-modal"), true));
  });
}

function setupViewSwitcher() {
  const select = document.getElementById("select-options");
  select?.addEventListener("change", () => {
    const value = select.value;
    membersContainer.classList.toggle("active", value === "Members");
    treeContainer.classList.toggle("active", value === "Officers");
  });
}

const dom = {
  deleteModal: document.getElementById("delete-modal"),
  deleteNameSpan: document.getElementById("faculty-to-delete-name"),
  deleteEntitySpan: document.getElementById("entity-context"),
  cancelDeleteBtn: document.getElementById("cancel-delete"),
  confirmDeleteBtn: document.getElementById("confirm-delete"),

  membersTable: document.getElementById("membersTable"),
  deleteMembersBtn: document.getElementById("delete-selected-members-btn"),
  selectAllMembersCheckbox: document.getElementById("select-all-members"),

  clubsTable: document.getElementById("clubsTable"),
  selectAllClubsCheckbox: document.getElementById("select-all-clubs"),
  deleteClubsBtn: document.getElementById("delete-selected-clubs-btn"),

  clubEditModal: document.getElementById("add-club-modal"),
  clubNameInput: document.getElementById("club-name-input"),
  clubOfficerInput: document.getElementById("officer-in-charge-input"),
  closeClubEditBtn: document.getElementById("close-add-club-modal"),

  officersTable: document.getElementById("officersTable"),
  selectAllOfficersCheckbox: document.getElementById("select-all-officers"),
  deleteOfficersBtn: document.getElementById("delete-selected-officers-btn"),

  officerEditModal: document.getElementById("edit-officer-modal"),
  officerNameInput: document.getElementById("officer-name-input"),
  officerPositionInput: document.getElementById("officer-position-input"),
  closeOfficerEditBtn: document.getElementById("close-edit-officer-modal"),
};

const { openDeleteModal } = setupDeleteModal({
  deleteModal: dom.deleteModal,
  deleteNameSpan: dom.deleteNameSpan,
  deleteEntitySpan: dom.deleteEntitySpan,
  cancelButton: dom.cancelDeleteBtn,
  confirmButton: dom.confirmDeleteBtn,
});

function setupTableCheckboxControls({
  table, selectAllCheckbox, deleteBtn, updateUIFn
}) {
  const getCheckboxes = () => table.querySelectorAll("input[type='checkbox']");

  selectAllCheckbox?.addEventListener("change", () => {
    getCheckboxes().forEach(cb => cb.checked = selectAllCheckbox.checked);
    updateUIFn();
  });

  table?.addEventListener("change", e => {
    if (e.target.type === "checkbox") {
      if (!e.target.checked) selectAllCheckbox.checked = false;
      updateUIFn();
    }
  });

  return getCheckboxes;
}

const getMemberCheckboxes = setupTableCheckboxControls({
  table: dom.membersTable,
  selectAllCheckbox: dom.selectAllMembersCheckbox,
  deleteBtn: dom.deleteMembersBtn,
  updateUIFn: updateMemberUI
});

function updateMemberUI() {
  const anyChecked = [...getMemberCheckboxes()].some(cb => cb.checked);
  dom.deleteMembersBtn.classList.toggle("active", anyChecked);
  dom.membersTable.querySelectorAll(".delete-btn").forEach(btn => btn.style.display = anyChecked ? "none" : "inline-block");
}

dom.deleteMembersBtn?.addEventListener("click", e => {
  e.preventDefault();
  const rows = [...getMemberCheckboxes()].filter(cb => cb.checked).map(cb => cb.closest("tr"));
  if (rows.length) openDeleteModal(rows, `these ${rows.length} member(s)`, "Members");
});

dom.membersTable?.addEventListener("click", e => {
  if (e.target.classList.contains("delete-btn")) {
    const row = e.target.closest("tr");
    const name = row.querySelector("td")?.textContent.trim();
    openDeleteModal(row, name, "Members");
  }
});

const getClubCheckboxes = setupTableCheckboxControls({
  table: dom.clubsTable,
  selectAllCheckbox: dom.selectAllClubsCheckbox,
  deleteBtn: dom.deleteClubsBtn,
  updateUIFn: updateClubUI
});

function updateClubUI() {
  const anyChecked = [...getClubCheckboxes()].some(cb => cb.checked);
  dom.deleteClubsBtn.classList.toggle("active", anyChecked);
  dom.clubsTable.querySelectorAll(".table-actions").forEach(icon => icon.style.display = anyChecked ? "none" : "block");
}

dom.deleteClubsBtn?.addEventListener("click", e => {
  e.preventDefault();
  const rows = [...getClubCheckboxes()].filter(cb => cb.checked).map(cb => cb.closest("tr"));
  if (rows.length) openDeleteModal(rows, `these ${rows.length} club(s)`, "Clubs", updateClubUI);
});

dom.clubsTable?.addEventListener("click", e => {
  const row = e.target.closest("tr");
  if (!row) return;

  const name = row.querySelector("td:nth-child(1) p")?.innerText.trim() || "";

  if (e.target.classList.contains("edit-club-btn")) {
    dom.clubEditModal.classList.add("active");
  }

  if (e.target.classList.contains("delete-btn")) {
    openDeleteModal(row, name, "Club", updateClubUI);
  }
});

dom.closeClubEditBtn?.addEventListener("click", () => {
  dom.clubEditModal.classList.remove("active");
});

const getOfficerCheckboxes = setupTableCheckboxControls({
  table: dom.officersTable,
  selectAllCheckbox: dom.selectAllOfficersCheckbox,
  deleteBtn: dom.deleteOfficersBtn,
  updateUIFn: updateOfficerUI
});

function updateOfficerUI() {
  const anyChecked = [...getOfficerCheckboxes()].some(cb => cb.checked);
  dom.deleteOfficersBtn.classList.toggle("active", anyChecked);
  dom.officersTable.querySelectorAll(".table-actions").forEach(icon => icon.style.display = anyChecked ? "none" : "block");
}

dom.deleteOfficersBtn?.addEventListener("click", e => {
  e.preventDefault();
  const rows = [...getOfficerCheckboxes()].filter(cb => cb.checked).map(cb => cb.closest("tr"));
  if (rows.length) openDeleteModal(rows, `these ${rows.length} officer(s)`, "Officers", updateOfficerUI);
});

dom.officersTable?.addEventListener("click", e => {
  const row = e.target.closest("tr");
  if (!row) return;

  const name = row.querySelector("td p")?.innerText.trim() || "";
  const position = row.querySelector("td:nth-child(2)")?.innerText.trim() || "";

  if (e.target.classList.contains("edit-officer-btn")) {
    dom.officerNameInput.value = name;
    dom.officerPositionInput.value = position;
    dom.officerEditModal.classList.add("active");
  }

  if (e.target.classList.contains("delete-btn")) {
    openDeleteModal(row, name, "Officer", updateOfficerUI);
  }
});

dom.closeOfficerEditBtn?.addEventListener("click", () => {
  dom.officerEditModal.classList.remove("active");
});


renderClubs();
renderOfficerTree();
updateScrollButtons();
initModalTriggers();
setupViewSwitcher();