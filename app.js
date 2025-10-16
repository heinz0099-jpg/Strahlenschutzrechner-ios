document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");
  if (!app) return;

  // HEADER
  const header = document.createElement("div");
  header.className = "header";
  header.textContent = "Strahlenschutz-Rechner";
  app.appendChild(header);

  // NAV-BAR
  const navBar = document.createElement("div");
  navBar.className = "nav-bar";
  const buttons = ["Berechnen", "Verlauf", "Einstellungen"];
  buttons.forEach(text => {
    const btn = document.createElement("button");
    btn.className = "nav-button";
    btn.textContent = text;
    btn.addEventListener("click", () => alert(`Button "${text}" geklickt`));
    navBar.appendChild(btn);
  });
  app.appendChild(navBar);

  // MAIN CARD CONTAINER
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <p class="text-info">App läuft – hier werden später Formulare und Ergebnisse angezeigt.</p>
  `;
  app.appendChild(card);

  // TEST BUTTON
  const testBtn = document.createElement("button");
  testBtn.className = "main-button";
  testBtn.textContent = "Test Ergebnis";
  testBtn.addEventListener("click", () => {
    const resultBox = document.createElement("div");
    resultBox.className = "result-box";
    resultBox.innerHTML = `<span class="result-title">Ergebnis:</span> <span class="result-value">${Math.floor(Math.random()*100)}</span>`;
    card.appendChild(resultBox);
  });
  app.appendChild(testBtn);
});
