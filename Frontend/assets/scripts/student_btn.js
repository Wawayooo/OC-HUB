
  document.addEventListener("DOMContentLoaded", function () {
    const studentsToggle = document.querySelector(".student-nav");
    const submenu = document.querySelector(".nav .submenu");
    const arrowDown = document.querySelector(".arrow-down");

    studentsToggle.addEventListener("click", function (e) {
      e.preventDefault();
      submenu.classList.toggle("active");
      arrowDown.classList.toggle("active");
      studentsToggle.classList.toggle("clicked");
    });
  });