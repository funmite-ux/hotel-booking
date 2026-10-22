const guestTrigger = document.querySelector("#guests");
const guestPopover = document.querySelector("#guest-popover");
const adults = document.querySelector("#adult-count");
const children = document.querySelector("#child-count");
const destination = document.querySelector("#destination");
const stayCards = [...document.querySelectorAll(".stay-card")];
const noResults = document.querySelector("#no-results");

let guestCount = { adults: 2, children: 0 };

guestTrigger.addEventListener("click", (event) => {
  event.stopPropagation();
  guestPopover.classList.toggle("open");
});
document.addEventListener("click", (event) => {
  if (!guestPopover.contains(event.target) && event.target !== guestTrigger)
    guestPopover.classList.remove("open");
});
document.querySelectorAll("[data-step]").forEach((button) => {
  button.addEventListener("click", () => {
    const type = button.dataset.step;
    guestCount[type] = Math.max(
      type === "adults" ? 1 : 0,
      guestCount[type] + Number(button.dataset.change),
    );
    document.querySelector(
      `#${type === "adults" ? "adult" : "child"}-count`,
    ).textContent = guestCount[type];
    const total = guestCount.adults + guestCount.children;
    guestTrigger.textContent = `${total} guest${total === 1 ? "" : "s"}`;
  });
});

document.querySelectorAll("[data-destination]").forEach((button) => {
  button.addEventListener("click", () => {
    destination.value = button.dataset.destination;
    filterStays(button.dataset.destination);
    document.querySelector("#stays").scrollIntoView({ behavior: "smooth" });
  });
});

function filterStays(query) {
  const normalized = query.trim().toLowerCase();
  let visible = 0;
  stayCards.forEach((card) => {
    const matches =
      !normalized ||
      card.dataset.city.toLowerCase().includes(normalized) ||
      card.dataset.title.toLowerCase().includes(normalized);
    card.style.display = matches ? "" : "none";
    if (matches) visible += 1;
  });
  noResults.classList.toggle("visible", visible === 0);
}

document.querySelector("#search-form").addEventListener("submit", (event) => {
  event.preventDefault();
  filterStays(destination.value);
  document.querySelector("#stays").scrollIntoView({ behavior: "smooth" });
});
document.querySelector("#reset-search").addEventListener("click", () => {
  destination.value = "";
  filterStays("");
});
document.querySelector("#view-all").addEventListener("click", () => {
  destination.value = "";
  filterStays("");
  document.querySelector("#stays").scrollIntoView({ behavior: "smooth" });
});

document.querySelectorAll(".heart-button").forEach((button) => {
  button.addEventListener("click", () => {
    button.classList.toggle("saved");
    button.textContent = button.classList.contains("saved") ? "♥" : "♡";
  });
});

const backdrop = document.querySelector("#modal-backdrop");
const modalMessage = document.querySelector("#modal-message");
const loginButton = document.querySelector(".login-button");
const loginForm = document.querySelector("#login-form");
const loginError = document.querySelector("#login-error");

function updateLoginButton() {
  const user = localStorage.getItem("roamly-user");
  loginButton.textContent = user ? `Hi, ${user}` : "Log in";
  loginButton.dataset.loggedIn = user ? "true" : "false";
}

updateLoginButton();

function openModal(message) {
  modalMessage.textContent = message;
  backdrop.classList.add("show");
}
document.querySelectorAll("[data-open-modal]").forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.loggedIn === "true") {
      localStorage.removeItem("roamly-user");
      updateLoginButton();
      return;
    }
    loginForm.reset();
    loginError.textContent = "";
    openModal(
      "Save stays, manage bookings and keep your travel ideas in one place.",
    );
  });
});
document
  .querySelector("#modal-close")
  .addEventListener("click", () => backdrop.classList.remove("show"));
backdrop.addEventListener("click", (event) => {
  if (event.target === backdrop) backdrop.classList.remove("show");
});
loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = document.querySelector("#login-email").value.trim();
  const password = document.querySelector("#login-password").value;
  if (!email || password.length < 6) {
    loginError.textContent =
      "Enter a valid email and a password with 6 or more characters.";
    return;
  }
  const firstName = email.split("@")[0].split(/[._-]/)[0];
  localStorage.setItem(
    "roamly-user",
    firstName.charAt(0).toUpperCase() + firstName.slice(1),
  );
  updateLoginButton();
  modalMessage.textContent =
    "You are signed in. Your saved stays are ready whenever you are.";
  loginError.textContent = "";
  loginForm.querySelector("button").textContent = "Signed in ✓";
  setTimeout(() => backdrop.classList.remove("show"), 900);
});
