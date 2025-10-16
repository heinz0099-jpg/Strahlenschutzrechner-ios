document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");
  if (!app) return;

  // === HEADER ===
  const header = document.createElement("div");
  header.className = "header";
  header.textContent = "Strahlenschutz-Rechner";
  app.appendChild(header);

  // === NAV-BAR ===
  const navBar = document.createElement("div");
  navBar.className = "nav-bar";
  const navButtons = ["Berechnen", "Verlauf", "Einstellungen"];
  navButtons.forEach(text => {
    const btn = document.createElement("button");
    btn.className = "nav-button";
    btn.textContent = text;
    btn.addEventListener("click", () => alert(`Nav Button "${text}" geklickt`));
    navBar.appendChild(btn);
  });
  app.appendChild(navBar);

  // === FORMULAR CARD 1 ===
  const formCard1 = document.createElement("div");
  formCard1.className = "card";
  formCard1.innerHTML = `
    <label class="form-label" for="input1">Eingabe 1 (kGy/h):</label>
    <input type="number" id="input1" placeholder="Zahl eingeben">
    <label class="form-label" for="input2">Eingabe 2 (h):</label>
    <input type="number" id="input2" placeholder="Zahl eingeben">
    <button class="main-button" id="calcBtn1">Berechnen</button>
    <div class="result-box hidden" id="calcResult1">
      <span class="result-title">Ergebnis:</span>
      <span class="result-value">0</span>
    </div>
  `;
  app.appendChild(formCard1);

  // === FORMULAR CARD 2 ===
  const formCard2 = document.createElement("div");
  formCard2.className = "card";
  formCard2.innerHTML = `
    <label class="form-label" for="input3">Eingabe 3:</label>
    <input type="number" id="input3" placeholder="Zahl eingeben">
    <button class="main-button" id="calcBtn2">Berechnen 2</button>
    <div class="result-box hidden" id="calcResult2">
      <span class="result-title">Ergebnis 2:</span>
      <span class="result-value">0</span>
    </div>
  `;
  app.appendChild(formCard2);

  // === DUMMY-LOGIK FORM 1 ===
  const calcBtn1 = document.getElementById("calcBtn1");
  const calcResult1 = document.getElementById("calcResult1");
  calcBtn1.addEventListener("click", () => {
    calcResult1.classList.remove("hidden");
    const val1 = Number(document.getElementById("input1").value) || 0;
    const val2 = Number(document.getElementById("input2").value) || 0;
    calcResult1.querySelector(".result-value").textContent = val1 * val2; // Beispielberechnung
  });

  // === DUMMY-LOGIK FORM 2 ===
  const calcBtn2 = document.getElementById("calcBtn2");
  const calcResult2 = document.getElementById("calcResult2");
  calcBtn2.addEventListener("click", () => {
    calcResult2.classList.remove("hidden");
    const val3 = Number(document.getElementById("input3").value) || 0;
    calcResult2.querySelector(".result-value").textContent = val3 * 2; // Beispielberechnung
  });

  // === TEST BUTTON ===
  const testBtn = document.createElement("button");
  testBtn.className = "main-button";
  testBtn.textContent = "Test Ergebnis";
  testBtn.addEventListener("click", () => {
    const resultBox = document.createElement("div");
    resultBox.className = "result-box";
    resultBox.innerHTML = `<span class="result-title">Test:</span> <span class="result-value">${Math.floor(Math.random()*100)}</span>`;
    app.appendChild(resultBox);
  });
  app.appendChild(testBtn);
});
