const addButton = document.querySelector("#mock-add");
const form = document.querySelector("#mock-form");
const input = document.querySelector("#mock-input");

if (addButton && form && input) {
  addButton.addEventListener("click", () => {
    const isHidden = form.classList.toggle("is-hidden");
    addButton.setAttribute("aria-expanded", String(!isHidden));
    if (!isHidden) {
      input.focus();
    }
  });
}
