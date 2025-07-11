const passwordInput = document.getElementById("password");
const monkeyStates = {
  open: document.querySelector(".monkey-open-eyes"),
  close: document.querySelector(".monkey-close-eyes"),
  wowed: document.querySelector(".monkey-wowed"),
};
const toggleButtons = {
  show: document.getElementById("show-pass"),
  hide: document.getElementById("hide-pass"),
};

function showMonkey(state) {
  Object.values(monkeyStates).forEach((monkey) =>
    monkey.classList.remove("active")
  );
  monkeyStates[state]?.classList.add("active");
}

function togglePasswordVisibility(show) {
  passwordInput.type = show ? "text" : "password";
  toggleButtons.show.classList.toggle("active", !show);
  toggleButtons.hide.classList.toggle("active", show);
  showMonkey(
    show ? "wowed" : document.activeElement === passwordInput ? "close" : "open"
  );
}

function updateToggleButtons() {
  const hasText = passwordInput.value.length > 0;
  toggleButtons.show.classList.toggle("active", !hasText);
  toggleButtons.hide.classList.toggle("active", hasText);
}

passwordInput.addEventListener("focus", () => {
  if (passwordInput.type === "password") showMonkey("close");
});

passwordInput.addEventListener("blur", () => {
  if (passwordInput.type === "password") showMonkey("open");
});

passwordInput.addEventListener("input", updateToggleButtons);

toggleButtons.show.addEventListener("click", () =>
  togglePasswordVisibility(true)
);
toggleButtons.hide.addEventListener("click", () =>
  togglePasswordVisibility(false)
);
