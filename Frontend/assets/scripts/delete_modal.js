export function setupDeleteModal({
  deleteModal,
  deleteNameSpan,
  deleteEntitySpan,
  cancelButton,
  confirmButton
}) {
  let rowsToDelete = null;

  function openDeleteModal(rows, name, entity) {
    rowsToDelete = rows;
    deleteNameSpan.textContent = name;
    deleteEntitySpan.textContent = entity;
    deleteModal.classList.add("active");
  }

  function closeDeleteModal() {
    deleteModal.classList.remove("active");
    rowsToDelete = null;
  }

  function confirmDelete() {
    const targets = Array.isArray(rowsToDelete) ? rowsToDelete : [rowsToDelete];
    targets.forEach(row => row?.remove());
    closeDeleteModal();
  }

  cancelButton.addEventListener("click", closeDeleteModal);
  confirmButton.addEventListener("click", confirmDelete);

  return { openDeleteModal };
}

export function bindDeleteButtons({
  tableSelector,
  bulkDeleteButton,
  headerSelector,
  openDeleteModal
}) {
  const getAll = selector => document.querySelectorAll(selector);

  function getEntityText() {
    return document.querySelector(headerSelector)?.textContent.trim() || "Item";
  }

  getAll(`${tableSelector} .delete-btn`).forEach(btn => {
    btn.addEventListener("click", () => {
      const row = btn.closest("tr");
      const name = row.querySelector("td")?.textContent.trim().split("\n").pop().trim() || "Item";
      openDeleteModal(row, name, getEntityText());
    });
  });

  bulkDeleteButton?.addEventListener("click", e => {
    e.preventDefault();
    const selected = [...getAll(`${tableSelector} tbody input[type='checkbox']:checked`)];
    if (!selected.length) return;

    const rows = selected.map(cb => cb.closest("tr"));
    openDeleteModal(rows, `this ${rows.length} item/s`, getEntityText());
  });
}
