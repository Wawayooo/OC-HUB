const showProfileBtn = document.getElementById('show-profile');
  const showParentsBtn = document.getElementById('show-parents');
  const showSubjectsBtn = document.getElementById('show-subjects');
  const profileContent = document.querySelector('.profile-content');
  const tableContent = document.querySelector('.table-cont');
  const subjectsContent = document.querySelector('.subjects');

  showProfileBtn.addEventListener('click', () => {
    profileContent.style.display = 'block';
    tableContent.style.display = 'none';
    subjectsContent.style.display = 'none';
  });

  showParentsBtn.addEventListener('click', () => {
    profileContent.style.display = 'none';
    tableContent.style.display = 'block';
    subjectsContent.style.display = 'none';
  });

  showSubjectsBtn.addEventListener('click', () => {
    profileContent.style.display = 'none';
    subjectsContent.style.display = 'block';
    tableContent.style.display = 'none';
  });


window.addEventListener('DOMContentLoaded', () => {
  const name = localStorage.getItem('selectedStudentName');
  const avatar = localStorage.getItem('selectedStudentAvatar');

  if (name && avatar) {
    const nameElement = document.querySelector('.right_profile h1');
    const sideName = document.querySelector('.side_profile .side_info h2');

    if (nameElement) nameElement.textContent = name;
    if (sideName) sideName.textContent = 'Basic Information :'; 
    const imgElement = document.querySelector('.side_profile img');
    if (imgElement) imgElement.src = avatar;
  }
});

const addBtn = document.getElementById("addFamilyBtn");
  const addModal = document.getElementById("addFamilyModal");
  const saveBtn = document.getElementById("saveFamilyBtn");
  const cancelBtn = document.getElementById("cancelAddBtn");
  const tableBody = document.querySelector("table tbody");

  addBtn.addEventListener("click", () => {
    addModal.classList.add("active");
  });


  cancelBtn.addEventListener("click", () => {
    addModal.classList.remove("active");
    clearInputs();
  });

  function clearInputs() {
    document.getElementById("fmName").value = '';
    document.getElementById("fmRelation").value = '';
    document.getElementById("fmContact").value = '';
    document.getElementById("fmStatus").value = '';
    document.getElementById("fmOccupation").value = '';
  }

  saveBtn.addEventListener("click", () => {
    const name = document.getElementById("fmName").value;
    const relation = document.getElementById("fmRelation").value;
    const contact = document.getElementById("fmContact").value;
    const status = document.getElementById("fmStatus").value;
    const occupation = document.getElementById("fmOccupation").value;

    const newRow = document.createElement("tr");
    newRow.innerHTML = `
      <td><input type="checkbox"> ${name}</td>
      <td><p class="course-desc">${relation}</p></td>
      <td><p class="course-desc">${contact}</p></td>
      <td>${status}</td>
      <td>${occupation}</td>
      <td>
        <div class="table-actions">
          <i class="edit-courses fa-solid fa-pen-to-square"></i>
          <i class="delete-btn fa-solid fa-trash"></i>
        </div>
      </td>
    `;

    tableBody.appendChild(newRow);
    addModal.classList.remove("active");
    clearInputs();
  });


   // para sa subject modal
  const addSubjectBtn = document.getElementById("addSubjectBtn");
  const subjectModal = document.getElementById("addSubjectModal");
  const saveSubjectBtn = document.getElementById("saveSubjectBtn");
  const cancelSubjectBtn = document.getElementById("cancelSubjectBtn");
  const subjectTableBody = document.querySelector(".subjects table tbody");

 
  addSubjectBtn.addEventListener("click", () => {
    subjectModal.classList.add("active");
  });

  cancelSubjectBtn.addEventListener("click", () => {
    subjectModal.classList.remove("active");
  });

  saveSubjectBtn.addEventListener("click", () => {
    const code = document.getElementById("subjectCode").value;
    const desc = document.getElementById("subjectDesc").value;
    const instructor = document.getElementById("subjectInstructor").value;
    const year = document.getElementById("subjectYear").value;
    const room = document.getElementById("subjectRoom").value;

    if (!code || !desc || !instructor || !year || !room) return alert("Please fill all fields.");

    const row = document.createElement("tr");
    row.innerHTML = `
      <td><input type="checkbox"> ${code}</td>
      <td><p class="course-desc">${desc}</p></td>
      <td><p class="course-desc">${instructor}</p></td>
      <td>${year}</td>
      <td>${room}</td>
      <td>
        <div class="table-actions">
          <i class="edit-courses fa-solid fa-pen-to-square"></i>
          <i class="delete-btn fa-solid fa-trash"></i>
        </div>
      </td>
    `;

    subjectTableBody.appendChild(row);
    subjectModal.classList.remove("active");
    document.querySelectorAll("#addSubjectModal input").forEach(input => input.value = "");
  });

  