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

  // === Hilfsfunktion zur Erstellung von Formularen ===
  function createFormCard(id, label1, label2, formulaFunc, unit) {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <label class="form-label" for="${id}_input1">${label1}</label>
      <input type="number" id="${id}_input1" placeholder="Zahl eingeben">
      ${label2 ? `<label class="form-label" for="${id}_input2">${label2}</label>
      <input type="number" id="${id}_input2" placeholder="Zahl eingeben">` : ""}
      <button class="main-button" id="${id}_btn">Berechnen</button>
      <div class="result-box hidden" id="${id}_result">
        <span class="result-title">Ergebnis:</span>
        <span class="result-value">0</span> ${unit}
      </div>
    `;
    app.appendChild(card);

    const btn = document.getElementById(`${id}_btn`);
    const resultBox = document.getElementById(`${id}_result`);
    btn.addEventListener("click", () => {
      resultBox.classList.remove("hidden");
      const val1 = Number(document.getElementById(`${id}_input1`).value) || 0;
      const val2 = label2 ? Number(document.getElementById(`${id}_input2`).value) || 0 : 0;
      const result = formulaFunc(val1, val2);
      resultBox.querySelector(".result-value").textContent = result.toFixed(2);
    });
  }

  // === 7 Berechnungen ===
  // 1. Exposition (Dosisrate * Zeit) -> µSv
  createFormCard("calc1", "Dosisrate (µSv/h)", "Zeit (h)", (v1,v2) => v1*v2, "µSv");

  // 2. Umrechnung Sv zu µSv -> µSv
  createFormCard("calc2", "Dosis (Sv)", null, v1 => v1*1e6, "µSv");

  // 3. Umrechnung µSv zu Sv -> Sv
  createFormCard("calc3", "Dosis (µSv)", null, v1 => v1/1e6, "Sv");

  // 4. Schutzfaktor Berechnung -> µSv
  createFormCard("calc4", "Dosis (µSv)", "Schutzfaktor", (v1,v2) => v1/v2, "µSv");

  // 5. Kumulative Exposition -> µSv
  createFormCard("calc5", "Dosisrate (µSv/h)", "Zeit (h)", (v1,v2) => v1*v2, "µSv");

  // 6. Grenzwertvergleich -> µSv
  createFormCard("calc6", "Gemessene Dosis (µSv)", "Grenzwert (µSv)", (v1,v2) => v1/v2, "µSv");

  // 7. Reduzierte Dosis nach Abschirmung -> µSv
  createFormCard("calc7", "Dosis (µSv)", "Abschirmung (Faktor)", (v1,v2) => v1/v2, "µSv");

  // === TEST BUTTON FÜR DEBUG ===
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
