// --- Hilfsfunktionen ---
function formatToGerman(number, precision) {
    return number.toLocaleString('de-DE', { useGrouping: false, minimumFractionDigits: precision, maximumFractionDigits: precision });
}

function getInputValue(elementId) {
    const element = document.getElementById(elementId);
    let value = element.value || element.placeholder;
    value = value.replace(',', '.'); 
    const result = parseFloat(value);
    return isNaN(result) ? NaN : result; 
}

// --- Navigation ---
const screens = {
    'distanz': document.getElementById('screen-distanz'),
    'einheit': document.getElementById('screen-einheit'),
    'dauer': document.getElementById('screen-dauer'),
    'total-dose': document.getElementById('screen-total-dose'),
    'tkz': document.getElementById('screen-tkz'),
    'aktivitaet': document.getElementById('screen-aktivitaet'),
    'schutzwert': document.getElementById('screen-schutzwert')
};

const navButtons = {
    'distanz': document.getElementById('nav-distanz'),
    'einheit': document.getElementById('nav-einheit'),
    'dauer': document.getElementById('nav-dauer'),
    'total-dose': document.getElementById('nav-total-dose'),
    'tkz': document.getElementById('nav-tkz'),
    'aktivitaet': document.getElementById('nav-aktivitaet'),
    'schutzwert': document.getElementById('nav-schutzwert')
};

function showScreen(screenId) {
    for (const id in screens) {
        if (screens[id]) {
            screens[id].classList.toggle('hidden', id !== screenId);
        }
        if (navButtons[id]) {
            navButtons[id].classList.toggle('active', id === screenId);
        }
    }
}

window.addEventListener('load', () => showScreen('distanz'));

// --- 1. Quadratisches Abstandsgesetz ---
function calculateDistanz() {
    const h1 = getInputValue('dosisleistung1');
    const r1 = getInputValue('abstand1');
    const r2 = getInputValue('abstand2');
    const resultBox = document.getElementById('result-distanz');

    if (isNaN(h1) || isNaN(r1) || isNaN(r2) || h1 <= 0 || r1 <= 0 || r2 <= 0) {
        resultBox.classList.remove('hidden', 'error');
        resultBox.classList.add('error');
        resultBox.innerHTML = 'Bitte alle Felder mit gültigen Werten (> 0) ausfüllen.';
        return;
    }

    const h2 = h1 * (Math.pow(r1, 2) / Math.pow(r2, 2));
    const h2Formatted = formatToGerman(h2, 3);

    resultBox.classList.remove('error');
    resultBox.innerHTML = `<div class="result-title">Neue Dosisleistung (H2):</div><div class="result-value">${h2Formatted} μSv/h</div>`;
    resultBox.classList.remove('hidden');
}

// --- 2. Einheitenumrechner ---
function calculateEinheit() {
    const wert = getInputValue('wert-einheit');
    const quelle = document.getElementById('einheit-quelle').value;
    const resultBox = document.getElementById('result-einheit');

    if (isNaN(wert)) {
        resultBox.classList.remove('hidden', 'error');
        resultBox.classList.add('error');
        resultBox.innerHTML = 'Bitte einen gültigen Wert eingeben.';
        return;
    }

    let inMicroSvH = 0;
    switch(quelle) {
        case 'micro': inMicroSvH = wert; break;
        case 'milli': inMicroSvH = wert * 1000; break;
        case 'sievert': inMicroSvH = wert * 1000000; break;
    }

    const milliSvH = inMicroSvH / 1000;
    const svH = inMicroSvH / 1000000;

    resultBox.classList.remove('error');
    resultBox.innerHTML = `
        <div class="result-title">Ergebnis:</div>
        <p><strong>Mikrosievert:</strong> ${formatToGerman(inMicroSvH, 6)} μSv/h</p>
        <p><strong>Millisievert:</strong> ${formatToGerman(milliSvH, 6)} mSv/h</p>
        <p><strong>Sievert:</strong> ${formatToGerman(svH, 9)} Sv/h</p>
    `;
    resultBox.classList.remove('hidden');
}

// --- 3. Maximale Aufenthaltsdauer ---
function calculateDauer() {
    const dosisleistung = getInputValue('dosisleistung-dauer');
    const zieldosis = getInputValue('zieldosis-dauer');
    const resultBox = document.getElementById('result-dauer');

    if (isNaN(dosisleistung) || isNaN(zieldosis) || dosisleistung <= 0 || zieldosis <= 0) {
        resultBox.classList.remove('hidden', 'error');
        resultBox.classList.add('error');
        resultBox.innerHTML = 'Bitte alle Felder mit gültigen Werten ausfüllen.';
        return;
    }

    const dauerInStunden = zieldosis / dosisleistung;
    const stunden = Math.floor(dauerInStunden);
    const minuten = Math.floor((dauerInStunden - stunden) * 60);
    const sekunden = Math.round(((dauerInStunden - stunden) * 60 - minuten) * 60);

    const dauerFormatted = formatToGerman(dauerInStunden, 2);

    resultBox.classList.remove('error');
    resultBox.innerHTML = `
        <div class="result-title">Maximale Aufenthaltsdauer:</div>
        <div class="result-value">${dauerFormatted} Stunden</div>
        <div style="font-size:0.875rem;">(${stunden} h, ${minuten} min, ${sekunden} s)</div>
    `;
    resultBox.classList.remove('hidden');
}

// --- 4. Gesamtdosis ---
function calculateTotalDose() {
    const dosisleistung = getInputValue('dosisleistung-total');
    const stunden = parseFloat(document.getElementById('stunden-total').value || 0);
    const minuten = parseFloat(document.getElementById('minuten-total').value || 0);
    const sekunden = parseFloat(document.getElementById('sekunden-total').value || 0);
    const resultBox = document.getElementById('result-total-dose');

    if (isNaN(dosisleistung) || dosisleistung <= 0) {
        resultBox.classList.remove('hidden', 'error');
        resultBox.classList.add('error');
        resultBox.innerHTML = 'Bitte alle Felder korrekt ausfüllen.';
        return;
    }

    const totalHours = stunden + minuten/60 + sekunden/3600;
    const totalDosis = dosisleistung * totalHours;

    resultBox.classList.remove('error');
    resultBox.innerHTML = `
        <div class="result-title">Aufgenommene Gesamtdosis:</div>
        <div class="result-value">${formatToGerman(totalDosis, 3)} μSv</div>
    `;
    resultBox.classList.remove('hidden');
}

// --- 5. TKZ ---
function calculateTKZ() {
    const tkz = getInputValue('eingabe-tkz');
    const dl = getInputValue('eingabe-tkz-dl');
    const resultBox = document.getElementById('result-tkz');

    if (isNaN(tkz) && isNaN(dl)) {
        resultBox.classList.remove('hidden', 'error');
        resultBox.classList.add('error');
        resultBox.innerHTML = 'Bitte mindestens einen Wert eingeben.';
        return;
    }

    let resultTKZ, resultDL;
    if (!isNaN(dl)) {
        resultDL = dl;
        resultTKZ = Math.ceil(dl*10)/10;
    } else {
        resultTKZ = tkz;
        resultDL = tkz;
    }

    resultBox.classList.remove('error');
    resultBox.innerHTML = `
        <div class="result-title">Ergebnisse:</div>
        <p><strong>Dosisleistung:</strong> ${formatToGerman(resultDL,3)} μSv/h</p>
        <p><strong>Transportkennzahl:</strong> ${formatToGerman(resultTKZ,1)}</p>
    `;
    resultBox.classList.remove('hidden');
}

// --- 6. Aktivität ---
function toggleManualGammaH() {
    const select = document.getElementById('dosisleistungskonstante-select');
    const manualInput = document.getElementById('dosisleistungskonstante-manuell');
    manualInput.classList.toggle('hidden', select.value !== 'manuell');
    if(select.value==='manuell') manualInput.focus();
}

function convertActivityToMBq(value, unit) {
    switch(unit){
        case 'Bq': return value/1000000;
        case 'kBq': return value/1000;
        case 'MBq': return value;
        case 'GBq': return value*1000;
    }
    return 0;
}

function calculateAktivitaet() {
    const activity = getInputValue('aktivitaet');
    const unit = document.getElementById('aktivitaet-unit').value;
    const resultBox = document.getElementById('result-aktivitaet');

    if (isNaN(activity)) {
        resultBox.classList.remove('hidden', 'error');
        resultBox.classList.add('error');
        resultBox.innerHTML = 'Bitte gültigen Wert eingeben.';
        return;
    }

    const mbq = convertActivityToMBq(activity, unit);

    resultBox.classList.remove('error');
    resultBox.innerHTML = `
        <div class="result-title">Aktivität in MBq:</div>
        <div class="result-value">${formatToGerman(mbq,3)} MBq</div>
    `;
    resultBox.classList.remove('hidden');
}

// --- 7. Schutzwert ---
function calculateSchutzwert() {
    const ohne = getInputValue('ohne-schutz');
    const mit = getInputValue('mit-schutz');
    const resultBox = document.getElementById('result-schutzwert');

    if (isNaN(ohne) || isNaN(mit) || ohne<=0 || mit<=0) {
        resultBox.classList.remove('hidden', 'error');
        resultBox.classList.add('error');
        resultBox.innerHTML = 'Bitte alle Felder korrekt ausfüllen.';
        return;
    }

    const faktor = ohne / mit;

    resultBox.classList.remove('error');
    resultBox.innerHTML = `
        <div class="result-title">Schutzfaktor:</div>
        <div class="result-value">${formatToGerman(faktor,2)}</div>
    `;
    resultBox.classList.remove('hidden');
}
