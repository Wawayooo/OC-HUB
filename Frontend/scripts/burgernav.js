const hamburger = document.querySelector(".hamburger");
const navMenu = document.getElementById("nav-menu");
const navLinks = document.querySelectorAll(".nav-link");

hamburger.addEventListener("click", () => {
  const expanded = hamburger.getAttribute("aria-expanded") === "true";
  hamburger.setAttribute("aria-expanded", !expanded);
  navMenu.classList.toggle("open");

  /* Switch icon */
  hamburger.textContent = expanded ? "☰" : "✕";
});

/* Close the menu after a link is chosen (mobile only) */
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (window.innerWidth <= 768) {
      navMenu.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
      hamburger.textContent = "☰";
    }
  });
});

/* Close on outside click */
document.addEventListener("click", (e) => {
  if (
    !navMenu.contains(e.target) &&
    e.target !== hamburger &&
    navMenu.classList.contains("open")
  ) {
    navMenu.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
    hamburger.textContent = "☰";
  }
});

/* Close on Esc key */
document.addEventListener("keyup", (e) => {
  if (e.key === "Escape" && navMenu.classList.contains("open")) {
    navMenu.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
    hamburger.textContent = "☰";
  }
});
