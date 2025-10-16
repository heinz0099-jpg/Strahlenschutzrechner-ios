document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");
  if (!app) return;

  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <h2 class="subheader">Strahlenschutz-Rechner</h2>
    <p class="text-info">App läuft korrekt – Service Worker aktiv.</p>
    <button class="main-button" id="testBtn">Test Button</button>
    <div class="result-box hidden" id="resultBox">
      <span class="result-title">Ergebnis:</span>
      <span class="result-value">0</span>
    </div>
  `;
  app.appendChild(card);

  const btn = document.getElementById("testBtn");
  const resultBox = document.getElementById("resultBox");

  btn.addEventListener("click", () => {
    resultBox.classList.remove("hidden");
    resultBox.querySelector(".result-value").textContent = Math.floor(Math.random() * 100);
  });
});
