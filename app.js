// --- HILFSFUNKTIONEN ---
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

// --- NAVIGATION ---
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

window.addEventListener('DOMContentLoaded', () => {
    showScreen('distanz');

    // --- EVENTLISTENER FÜR BUTTONS ---
    const calcMap = {
        'distanz': calculateDistanz,
        'einheit': calculateEinheit,
        'dauer': calculateDauer,
        'total-dose': calculateTotalDose,
        'tkz': calculateTKZ,
        'aktivitaet': calculateAktivitaet,
        'schutzwert': calculateSchutzwert
    };

    for (const id in calcMap) {
        const btn = document.getElementById('nav-' + id);
        if (btn) {
            btn.addEventListener('click', () => {
                showScreen(id);
            });
        }
    }

    // --- BUTTONS IN DEN SCREENS ---
    const screenButtons = {
        'distanz': 'calculateDistanz',
        'einheit': 'calculateEinheit',
        'dauer': 'calculateDauer',
        'total-dose': 'calculateTotalDose',
        'tkz': 'calculateTKZ',
        'aktivitaet': 'calculateAktivitaet',
        'schutzwert': 'calculateSchutzwert'
    };

    for (const screenId in screenButtons) {
        const btn = document.querySelector(`#screen-${screenId} .main-button`);
        if (btn) {
            btn.addEventListener('click', window[screenButtons[screenId]]);
        }
    }

    // GammaH manuell toggle
    const gammaSel = document.getElementById('dosisleistungskonstante-select');
    if (gammaSel) gammaSel.addEventListener('change', toggleManualGammaH);
});

// --- BERECHNUNGSFUNKTIONEN ---

function calculateDistanz() {
    const h1 = getInputValue('dosisleistung1');
    const r1 = getInputValue('abstand1');
    const r2 = getInputValue('abstand2');
    const resultBox = document.getElementById('result-distanz');

    if (isNaN(h1) || isNaN(r1) || isNaN(r2) || h1 <= 0 || r1 <= 0 || r2 <= 0) {
        resultBox.classList.remove('hidden');
        resultBox.classList.add('error');
        resultBox.innerHTML = 'Bitte alle Felder mit gültigen Werten (> 0) ausfüllen.';
        return;
    }

    const h2 = h1 * (r1 * r1) / (r2 * r2);
    resultBox.classList.remove('error');
    resultBox.innerHTML = `<div class="result-title">Neue Dosisleistung (H2):</div><div class="result-value">${formatToGerman(h2,3)} μSv/h</div>`;
    resultBox.classList.remove('hidden');
}

function calculateEinheit() {
    const wert = getInputValue('wert-einheit');
    const quelle = document.getElementById('einheit-quelle').value;
    const resultBox = document.getElementById('result-einheit');

    if (isNaN(wert)) {
        resultBox.classList.remove('hidden');
        resultBox.classList.add('error');
        resultBox.innerHTML = 'Bitte einen gültigen Wert eingeben.';
        return;
    }

    let inMicroSvH;
    switch (quelle) {
        case 'micro': inMicroSvH = wert; break;
        case 'milli': inMicroSvH = wert * 1000; break;
        case 'sievert': inMicroSvH = wert * 1000000; break;
        default: inMicroSvH = 0;
    }

    const milliSvH = inMicroSvH / 1000;
    const svH = inMicroSvH / 1000000;

    resultBox.classList.remove('error');
    resultBox.innerHTML = `<div class="result-title mb-2">Ergebnis (alle in pro Stunde):</div>
        <p><strong>μSv/h:</strong> ${formatToGerman(inMicroSvH,6)}</p>
        <p><strong>mSv/h:</strong> ${formatToGerman(milliSvH,6)}</p>
        <p><strong>Sv/h:</strong> ${formatToGerman(svH,9)}</p>`;
    resultBox.classList.remove('hidden');
}

function calculateDauer() {
    const dosisleistung = getInputValue('dosisleistung-dauer');
    const zieldosis = getInputValue('zieldosis-dauer');
    const resultBox = document.getElementById('result-dauer');

    if (isNaN(dosisleistung) || isNaN(zieldosis) || dosisleistung <= 0 || zieldosis <= 0) {
        resultBox.classList.remove('hidden');
        resultBox.classList.add('error');
        resultBox.innerHTML = 'Bitte alle Felder mit gültigen Werten (> 0) ausfüllen.';
        return;
    }

    const dauerInStunden = zieldosis / dosisleistung;
    const stunden = Math.floor(dauerInStunden);
    const minutenGesamt = (dauerInStunden - stunden) * 60;
    const minuten = Math.floor(minutenGesamt);
    const sekunden = Math.round((minutenGesamt - minuten) * 60);

    const dauerFormatted = formatToGerman(dauerInStunden,2);

    resultBox.classList.remove('error');
    resultBox.innerHTML = `<div class="result-title">Maximale Aufenthaltsdauer:</div>
        <div class="result-value">${dauerFormatted} Stunden</div>
        <div style="font-size:0.875rem;">(${stunden}h ${minuten}min ${sekunden}s)</div>`;
    resultBox.classList.remove('hidden');
}

function calculateTotalDose() {
    const dosisleistung = getInputValue('dosisleistung-total');
    const stunden = parseFloat(document.getElementById('stunden-total').value || 0);
    const minuten = parseFloat(document.getElementById('minuten-total').value || 0);
    const sekunden = parseFloat(document.getElementById('sekunden-total').value || 0);
    const resultBox = document.getElementById('result-total-dose');

    if (isNaN(dosisleistung) || dosisleistung <=0) return;
    const gesamtzeit = stunden + (minuten/60) + (sekunden/3600);
    const totalDosis = dosisleistung * gesamtzeit;

    resultBox.innerHTML = `<div class="result-title">Aufgenommene Gesamtdosis:</div><div class="result-value">${formatToGerman(totalDosis,3)} μSv</div>`;
    resultBox.classList.remove('hidden');
}

function calculateTKZ() {
    const tkz = getInputValue('eingabe-tkz');
    const dl = getInputValue('eingabe-tkz-dl');
    const resultBox = document.getElementById('result-tkz');

    let finalTKZ, finalDL;
    if(!isNaN(dl) && dl>0){
        finalDL = dl;
        finalTKZ = Math.ceil(dl*10)/10;
    } else if(!isNaN(tkz) && tkz>0){
        finalTKZ = tkz;
        finalDL = tkz;
    } else {
        resultBox.classList.add('error');
        resultBox.innerHTML = 'Bitte mindestens ein Feld ausfüllen';
        return;
    }

    resultBox.innerHTML = `<div class="result-title">Ergebnisse:</div>
        <p><strong>Dosisleistung:</strong> ${formatToGerman(finalDL,3)} μSv/h</p>
        <p><strong>Transportkennzahl (TKZ):</strong> ${formatToGerman(finalTKZ,1)}</p>`;
    resultBox.classList.remove('hidden');
}

function toggleManualGammaH() {
    const select = document.getElementById('dosisleistungskonstante-select');
    const manualInput = document.getElementById('dosisleistungskonstante-manuell');
    if(select.value==='manuell') manualInput.classList.remove('hidden'); 
    else manualInput.classList.add('hidden');
}

function convertActivityToMBq(value, unit){
    switch(unit){
        case 'Bq': return value/1000000;
        case 'kBq': return value/1000;
        case 'MBq': return value;
        case 'GBq': return value*1000;
        default: return 0;
    }
}

function calculateAktivitaet(){
    const A_Value = getInputValue('aktivitaet-wert');
    const A_Unit = document.getElementById('aktivitaet-einheit').value;
    const resultBox = document.getElementById('result-aktivitaet');

    if(isNaN(A_Value)){
        resultBox.classList.add('error');
        resultBox.innerHTML = 'Bitte einen gültigen Wert eingeben.';
        return;
    }

    const mbq = convertActivityToMBq(A_Value,A_Unit);

    resultBox.classList.remove('error');
    resultBox.innerHTML = `<div class="result-title">Aktivität:</div><div class="result-value">${formatToGerman(mbq,3)} MBq</div>`;
    resultBox.classList.remove('hidden');
}

function calculateSchutzwert(){
    const H = getInputValue('schutzwert-h');
    const SW = getInputValue('schutzwert-sw');
    const resultBox = document.getElementById('result-schutzwert');

    if(isNaN(H) || isNaN(SW) || H<=0 || SW<=0){
        resultBox.classList.add('error');
        resultBox.innerHTML = 'Bitte gültige Werte eingeben.';
        return;
    }

    const result = H / SW;

    resultBox.classList.remove('error');
    resultBox.innerHTML = `<div class="result-title">Ergebnis:</div><div class="result-value">${formatToGerman(result,3)}</div>`;
    resultBox.classList.remove('hidden');
}
