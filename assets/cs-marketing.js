const marketing = document.getElementById("cs-marketing");
const app = document.getElementById("root");

for (const button of document.querySelectorAll("[data-enter-preview]")) {
  button.addEventListener("click", () => {
    marketing.hidden = true;
    app.hidden = false;
    document.title = "Multi-Factor Authentication";
    window.scrollTo(0, 0);
    requestAnimationFrame(() => app.querySelector('input[type="password"]')?.focus());
  });
}