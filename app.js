// ================================
// APP.JS für Strahlenschutz-Rechner
// ================================

// --- Hilfsfunktionen ---
function formatToGerman(number, precision) {
    return number.toLocaleString('de-DE', { useGrouping: false, minimumFractionDigits: precision, maximumFractionDigits: precision });
}

function getInputValue(id) {
    const el = document.getElementById(id);
    let val = el.value || el.placeholder;
    val = val.replace(',', '.');
    const num = parseFloat(val);
    return isNaN(num) ? NaN : num;
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
        screens[id].classList.toggle('hidden', id !== screenId);
        navButtons[id].classList.toggle('active', id === screenId);
    }
}

window.addEventListener('load', () => showScreen('distanz'));

// ================================
// 1. Quadratisches Abstandsgesetz
// ================================
function calculateDistanz() {
    const h1 = getInputValue('dosisleistung1');
    const r1 = getInputValue('abstand1');
    const r2 = getInputValue('abstand2');
    const resultBox = document.getElementById('result-distanz');

    if (isNaN(h1) || isNaN(r1) || isNaN(r2) || h1 <= 0 || r1 <= 0 || r2 <= 0) {
        resultBox.className = 'result-box error';
        resultBox.innerHTML = 'Bitte alle Felder mit gültigen Werten (>0) ausfüllen.';
        return;
    }

    const h2 = h1 * (r1 ** 2) / (r2 ** 2);
    resultBox.className = 'result-box';
    resultBox.innerHTML = `
        <div class="result-title">Neue Dosisleistung (H2):</div>
        <div class="result-value">${formatToGerman(h2,3)} μSv/h</div>
    `;
}

// ================================
// 2. Einheiten-Umrechner
// ================================
function calculateEinheit() {
    const wert = getInputValue('wert-einheit');
    const quelle = document.getElementById('einheit-quelle').value;
    const resultBox = document.getElementById('result-einheit');

    if (isNaN(wert)) {
        resultBox.className = 'result-box error';
        resultBox.innerHTML = 'Bitte einen gültigen Wert eingeben.';
        return;
    }

    let micro;
    switch(quelle) {
        case 'micro': micro = wert; break;
        case 'milli': micro = wert*1000; break;
        case 'sievert': micro = wert*1000000; break;
        default: micro = wert;
    }

    resultBox.className = 'result-box';
    resultBox.innerHTML = `
        <div class="result-title">Ergebnis:</div>
        <p>Mikrosievert: ${formatToGerman(micro,6)} μSv/h</p>
        <p>Millisievert: ${formatToGerman(micro/1000,6)} mSv/h</p>
        <p>Sievert: ${formatToGerman(micro/1000000,9)} Sv/h</p>
    `;
}

// ================================
// 3. Maximale Aufenthaltsdauer
// ================================
function calculateDauer() {
    const dosis = getInputValue('dosisleistung-dauer');
    const zieldosis = getInputValue('zieldosis-dauer');
    const resultBox = document.getElementById('result-dauer');

    if (isNaN(dosis)||dosis<=0||isNaN(zieldosis)||zieldosis<=0){
        resultBox.className='result-box error';
        resultBox.innerHTML='Bitte alle Felder mit gültigen Werten (>0) ausfüllen.';
        return;
    }

    const dauerStunden = zieldosis/dosis;
    const stunden = Math.floor(dauerStunden);
    const minutenGes = (dauerStunden-stunden)*60;
    const minuten = Math.floor(minutenGes);
    const sekunden = Math.round((minutenGes-minuten)*60);

    resultBox.className='result-box';
    resultBox.innerHTML = `
        <div class="result-title">Maximale Aufenthaltsdauer:</div>
        <div class="result-value">${formatToGerman(dauerStunden,2)} Stunden</div>
        <div style="font-size:0.875rem;">(${stunden}h ${minuten}min ${sekunden}s)</div>
    `;
}

// ================================
// 4. Aufgenommene Gesamtdosis
// ================================
function calculateTotalDose() {
    const dosis = getInputValue('dosisleistung-total');
    const stunden = parseFloat(document.getElementById('stunden-total').value||0);
    const minuten = parseFloat(document.getElementById('minuten-total').value||0);
    const sekunden = parseFloat(document.getElementById('sekunden-total').value||0);
    const resultBox = document.getElementById('result-total-dose');

    if (isNaN(dosis)||dosis<=0) {
        resultBox.className='result-box error';
        resultBox.innerHTML='Bitte alle Felder mit gültigen Werten ausfüllen.';
        return;
    }

    const total = dosis * (stunden + minuten/60 + sekunden/3600);
    resultBox.className='result-box';
    resultBox.innerHTML = `<div class="result-title">Aufgenommene Gesamtdosis:</div><div class="result-value">${formatToGerman(total,3)} μSv</div>`;
}

// ================================
// 5. Transportkennzahl
// ================================
function calculateTKZ() {
    const tkz = getInputValue('eingabe-tkz');
    const dl = getInputValue('eingabe-tkz-dl');
    const resultBox = document.getElementById('result-tkz');

    if ((isNaN(tkz)&&isNaN(dl)) || (dl<=0 && isNaN(tkz)) || (tkz<=0 && isNaN(dl))) {
        resultBox.className='result-box error';
        resultBox.innerHTML='Bitte mindestens ein Feld mit gültigem Wert ausfüllen.';
        return;
    }

    let dlVal, tkzVal;
    if (!isNaN(dl)&&dl>0) {
        dlVal=dl;
        tkzVal=Math.ceil(dl*10)/10;
    } else {
        tkzVal=tkz;
        dlVal=tkz;
    }

    resultBox.className='result-box';
    resultBox.innerHTML = `
        <div class="result-title">Ergebnisse:</div>
        <p>Dosisleistung (DL): ${formatToGerman(dlVal,3)} μSv/h</p>
        <p>Transportkennzahl (TKZ): ${formatToGerman(tkzVal,1)}</p>
    `;
}

// ================================
// 6. Aktivität -> Dosisleistung
// ================================
function toggleManualGammaH() {
    const select = document.getElementById('dosisleistungskonstante-select');
    const manual = document.getElementById('dosisleistungskonstante-manuell');
    if(select.value==='manuell') { manual.classList.remove('hidden'); manual.value=''; manual.focus(); }
    else { manual.classList.add('hidden'); }
}

function convertActivityToMBq(val, unit) {
    switch(unit) {
        case 'Bq': return val/1000000;
        case 'kBq': return val/1000;
        case 'MBq': return val;
        case 'GBq': return val*1000;
        default: return 0;
    }
}

function calculateAktivitaet() {
    const A = getInputValue('aktivitaet-wert');
    const unit = document.getElementById('aktivitaet-einheit').value;
    const GammaSelect = document.getElementById('dosisleistungskonstante-select').value;
    const r = getInputValue('abstand-aktivitaet');
    const resultBox = document.getElementById('result-aktivitaet');

    let Gamma = GammaSelect==='manuell'?getInputValue('dosisleistungskonstante-manuell'):parseFloat(GammaSelect);
    if(isNaN(A)||isNaN(Gamma)||isNaN(r)||A<0||Gamma<=0||r<=0){
        resultBox.className='result-box error';
        resultBox.innerHTML='Bitte alle Felder korrekt ausfüllen.';
        return;
    }

    const A_MBq = convertActivityToMBq(A,unit);
    const dl = (A_MBq*Gamma)/(r**2);

    resultBox.className='result-box';
    resultBox.innerHTML = `
        <div class="result-title">Berechnete Dosisleistung:</div>
        <div class="result-value">${formatToGerman(dl,3)} μSv/h</div>
        <div style="font-size:0.875rem;">Verwendete Γ-Konstante: ${formatToGerman(Gamma,5)} μSv·m²/h·MBq</div>
    `;
}

// ================================
// 7. Abschirmung / Schutzwert
// ================================
function calculateSchutzwert() {
    const dl0 = getInputValue('dl-ohne-abschirmung');
    const dlx = getInputValue('dl-mit-abschirmung');
    const resultBox = document.getElementById('result-schutzwert');

    if(isNaN(dl0)||dl0<=0||isNaN(dlx)||dlx<0){
        resultBox.className='result-box error';
        resultBox.innerHTML='Bitte alle Felder korrekt ausfüllen.';
        return;
    }

    if(dlx===0){
        resultBox.className='result-box';
        resultBox.innerHTML='<div class="result-title">Schutzwert (S):</div><div class="result-value">∞</div><div style="font-size:0.875rem;">Perfekte Abschirmung.</div>';
        return;
    }

    const S = dl0/dlx;
    resultBox.className='result-box';
    resultBox.innerHTML = `
        <div class="result-title">Schutzwert (S):</div>
        <div class="result-value">${formatToGerman(S,2)}</div>
        <div style="font-size:0.875rem;">Dosisleistung wird um Faktor ${formatToGerman(S,2)} reduziert.</div>
    `;
}

// ================================
// Service Worker Registration
// ================================
if("serviceWorker" in navigator){
    navigator.serviceWorker.register("service-worker.js")
    .then(()=>console.log("Service Worker registriert"))
    .catch(err=>console.log("Service Worker Fehler:",err));
}
