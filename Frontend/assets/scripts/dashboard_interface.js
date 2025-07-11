const getById = id => document.getElementById(id);
const getAll = selector => document.querySelectorAll(selector);

const refs = {
  modals: {
    viewCourses: getById("view-courses-modal"),
    addCourse: getById("add-course-modal"),
    viewCourse: getById("view-course-modal"),
    faculty: getById("faculty-modal"),
    addFaculty: getById("add-faculty-modal")
  },
  inputs: {
    courseCode: getById("course-code-input"),
    courseDesc: getById("course-description-input"),
    instructor: getById("assign-instructor-select"),
    yearLevel: getById("year-level-select"),
    room: getById("room-input"),
    facultyName: getById("faculty-name-input"),
    facultyId: getById("faculty-id-input"),
    facultyJobTitle: getById("faculty-job-title-select"),
    facultyDept: getById("faculty-department-select"),
    facultyEducation: getById("faculty-education-select")
  },
  images: {
    facultyUpload: getById("upload-faculty-img"),
    facultyPreview: getById("faculty-preview")
  },
  buttons: {
    seeAllCourses: getById("see-all-courses"),
    closeViewCourses: getById("close-view-courses-modal"),
    openAddCourse: getById("open-add-course-modal-btn"),
    closeAddCourse: getById("close-add-course-modal"),
    openAddFaculty: getById("open-add-faculty-modal-btn"),
    closeAddFaculty: getById("close-add-faculty-modal"),
    viewFaculty: getById("view-faculty"),
    closeFaculty: getById("close-faculty-modal"),
    deleteFacultyBulk: getById("delete-selected-faculty-btn"),
    deleteCoursesBulk: getById("delete-selected-courses-btn")
  }
};

function toggleModals() {
  const { buttons: b, modals: m } = refs;
  b.seeAllCourses.addEventListener("click", () => m.viewCourses.classList.add("active"));
  b.closeViewCourses.addEventListener("click", () => m.viewCourses.classList.remove("active"));
  b.openAddCourse.addEventListener("click", () => m.addCourse.classList.add("active"));
  b.closeAddCourse.addEventListener("click", clearCourseModal);

  b.viewFaculty.addEventListener("click", () => m.faculty.classList.add("active"));
  b.closeFaculty.addEventListener("click", () => m.faculty.classList.remove("active"));
  b.openAddFaculty.addEventListener("click", () => m.addFaculty.classList.add("active"));
  b.closeAddFaculty.addEventListener("click", clearFacultyModal);

  getById("close-view-course-modal").addEventListener("click", () => m.viewCourse.classList.remove("active"));
  getAll(".view-spcfc-course").forEach(btn =>
    btn.addEventListener("click", () => m.viewCourse.classList.add("active"))
  );
}

function clearCourseModal() {
  refs.modals.addCourse.classList.remove("active");
  Object.values(refs.inputs).slice(0, 5).forEach(input => input.value = "");
}

function clearFacultyModal() {
  refs.modals.addFaculty.classList.remove("active");
  refs.inputs.facultyName.value = "";
  refs.inputs.facultyId.value = "";
  refs.inputs.facultyJobTitle.value = "";
  refs.inputs.facultyDept.value = "";
  refs.inputs.facultyEducation.value = "";
  refs.images.facultyPreview.src = "./assets/media/blank-profile-picture-973460.svg";
}

function bindCheckboxBulk(container, allId, deleteBtn, actionsSelector) {
  const selectAll = getById(allId);
  const checkboxes = getAll(`${container} tbody input[type='checkbox']`);
  const actions = getAll(actionsSelector);

  function updateUI() {
    const checked = [...checkboxes].filter(cb => cb.checked);
    selectAll.checked = checkboxes.length && checked.length === checkboxes.length;
    deleteBtn.classList.toggle("active", checked.length);
    actions.forEach(a => a.style.display = checked.length ? "none" : "flex");
  }

  selectAll.addEventListener("change", () => {
    checkboxes.forEach(cb => cb.checked = selectAll.checked);
    updateUI();
  });
  checkboxes.forEach(cb => cb.addEventListener("change", updateUI));
}

function bindEditButtons(selector, modal, inputs, extractDataFn) {
  getAll(selector).forEach(btn => {
    btn.addEventListener("click", () => {
      const row = btn.closest("tr");
      const data = extractDataFn(row);
      Object.entries(data).forEach(([k, v]) => {
        if (inputs[k]) inputs[k].value = v;
      });
      if (data.image && refs.images.facultyPreview) {
        refs.images.facultyPreview.src = data.image;
      }
      modal.classList.add("active");
    });
  });
}

function extractFacultyData(row) {
  const cells = row.querySelectorAll("td");
  return {
    image: row.querySelector(".img-cont img")?.src,
    facultyName: cells[0].textContent.trim().split("\n").pop().trim(),
    facultyId: cells[1].textContent.trim(),
    facultyJobTitle: cells[2].textContent.trim(),
    facultyDept: cells[3].textContent.trim(),
    facultyEducation: cells[4].textContent.trim()
  };
}

function extractCourseData(row) {
  const cells = row.querySelectorAll("td");
  return {
    courseCode: cells[0].textContent.trim(),
    courseDesc: cells[1].textContent.trim(),
    instructor: cells[2].textContent.trim(),
    yearLevel: cells[3].textContent.trim(),
    room: cells[4].textContent.trim()
  };
}

function previewImage(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = evt => refs.images.facultyPreview.src = evt.target.result;
    reader.readAsDataURL(file);
  }
}

import { setupDeleteModal, bindDeleteButtons } from './delete_modal.js';

function init() {
  toggleModals();
  bindCheckboxBulk(".faculty-modal", "select-all-faculties", refs.buttons.deleteFacultyBulk, ".table-actions");
  bindCheckboxBulk(".courses-cont", "select-all-courses", refs.buttons.deleteCoursesBulk, ".courses-cont .table-actions");

  bindEditButtons(".edit-faculty", refs.modals.addFaculty, refs.inputs, extractFacultyData);
  bindEditButtons(".edit-courses", refs.modals.addCourse, refs.inputs, extractCourseData);

  refs.images.facultyUpload.addEventListener("change", previewImage);

  const { openDeleteModal } = setupDeleteModal({
    deleteModal: document.getElementById("delete-modal"),
    deleteNameSpan: document.getElementById("faculty-to-delete-name"),
    deleteEntitySpan: document.getElementById("entity-context"),
    cancelButton: document.getElementById("cancel-delete"),
    confirmButton: document.getElementById("confirm-delete")
  });

  bindDeleteButtons({
    tableSelector: ".faculty-modal",
    bulkDeleteButton: refs.buttons.deleteFacultyBulk,
    headerSelector: ".faculty-modal .header h1",
    openDeleteModal
  });

  bindDeleteButtons({
    tableSelector: ".courses-cont",
    bulkDeleteButton: refs.buttons.deleteCoursesBulk,
    headerSelector: ".courses-cont .header h1",
    openDeleteModal
  });
}

init();
