// --- Hilfsfunktionen ---

// Formatiert Zahl auf deutsches Format mit fester Nachkommastelle
function formatToGerman(number, precision) {
    return number.toLocaleString('de-DE', { useGrouping: false, minimumFractionDigits: precision, maximumFractionDigits: precision });
}

// Liest Eingabefeld und wandelt Komma in Punkt um
function getInputValue(id) {
    const el = document.getElementById(id);
    let value = el.value || el.placeholder;
    value = value.replace(',', '.');
    const num = parseFloat(value);
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

for (const key in navButtons) {
    navButtons[key].addEventListener('click', () => {
        for (const k in screens) {
            screens[k].classList.add('hidden');
            navButtons[k].classList.remove('active');
        }
        screens[key].classList.remove('hidden');
        navButtons[key].classList.add('active');
    });
}

// --- 1. Quadratisches Abstandsgesetz ---
function calculateDistanz() {
    const h1 = getInputValue('dosisleistung1');
    const r1 = getInputValue('abstand1');
    const r2 = getInputValue('abstand2');
    const res = document.getElementById('result-distanz');

    if (isNaN(h1) || isNaN(r1) || isNaN(r2) || h1 <= 0 || r1 <= 0 || r2 <= 0) {
        res.classList.remove('hidden');
        res.classList.add('error');
        res.innerHTML = 'Bitte alle Felder mit gültigen Werten (> 0) ausfüllen.';
        return;
    }
    res.classList.remove('error');
    const h2 = h1 * (r1 * r1) / (r2 * r2);
    res.innerHTML = `<div class="result-title">Neue Dosisleistung (H2):</div><div class="result-value">${formatToGerman(h2,3)} μSv/h</div>`;
    res.classList.remove('hidden');
}

// --- 2. Einheiten-Umrechner ---
function calculateEinheit() {
    const wert = getInputValue('wert-einheit');
    const quelle = document.getElementById('einheit-quelle').value;
    const res = document.getElementById('result-einheit');

    if (isNaN(wert)) {
        res.classList.remove('hidden'); res.classList.add('error');
        res.innerHTML = 'Bitte einen gültigen Wert eingeben.';
        return;
    }
    res.classList.remove('error');

    let micro;
    switch(quelle){
        case 'micro': micro=wert; break;
        case 'milli': micro=wert*1000; break;
        case 'sievert': micro=wert*1000000; break;
    }

    res.innerHTML = `
        <div class="result-title">Ergebnis:</div>
        <p>Mikrosievert: ${formatToGerman(micro,6)} μSv/h</p>
        <p>Millisievert: ${formatToGerman(micro/1000,6)} mSv/h</p>
        <p>Sievert: ${formatToGerman(micro/1000000,9)} Sv/h</p>
    `;
    res.classList.remove('hidden');
}

// --- 3. Aufenthaltsdauer ---
function calculateDauer() {
    const dose = getInputValue('dosisleistung-dauer');
    const zield = getInputValue('zieldosis-dauer');
    const res = document.getElementById('result-dauer');

    if(isNaN(dose) || isNaN(zield) || dose<=0 || zield<=0){
        res.classList.remove('hidden'); res.classList.add('error');
        res.innerHTML='Bitte alle Felder mit gültigen Werten (>0) ausfüllen.'; return;
    }
    res.classList.remove('error');
    const stundenGesamt = zield/dose;
    const stunden = Math.floor(stundenGesamt);
    const minutenGesamt = (stundenGesamt-stunden)*60;
    const minuten = Math.floor(minutenGesamt);
    const sekunden = Math.round((minutenGesamt-minuten)*60);
    res.innerHTML = `<div class="result-title">Maximale Aufenthaltsdauer:</div><div class="result-value">${formatToGerman(stundenGesamt,2)} h</div><div>${stunden}h ${minuten}min ${sekunden}s</div>`;
    res.classList.remove('hidden');
}

// --- 4. Gesamtdosis ---
function calculateTotalDose(){
    const dose = getInputValue('dosisleistung-total');
    const stunden = parseFloat(document.getElementById('stunden-total').value||0);
    const minuten = parseFloat(document.getElementById('minuten-total').value||0);
    const sekunden = parseFloat(document.getElementById('sekunden-total').value||0);
    const res = document.getElementById('result-total-dose');

    if(isNaN(dose)||dose<=0){res.classList.remove('hidden');res.classList.add('error');res.innerHTML='Dosisleistung muss >0 sein'; return;}
    res.classList.remove('error');
    const gesamt = dose*(stunden+minuten/60+sekunden/3600);
    res.innerHTML=`<div class="result-title">Gesamtdosis:</div><div class="result-value">${formatToGerman(gesamt,3)} μSv</div>`;
    res.classList.remove('hidden');
}

// --- 5. TKZ/DL ---
function calculateTKZ(){
    const tkz = getInputValue('eingabe-tkz');
    const dl = getInputValue('eingabe-tkz-dl');
    const res = document.getElementById('result-tkz');
    let t,d;

    if(!isNaN(dl) && dl>0){d=dl; t=Math.ceil(dl*10)/10;}
    else if(!isNaN(tkz) && tkz>0){t=tkz; d=tkz;}
    else{res.classList.remove('hidden'); res.classList.add('error'); res.innerHTML='Bitte ein Feld ausfüllen'; return;}

    res.classList.remove('error');
    res.innerHTML=`<div class="result-title">Ergebnis:</div><p>Dosisleistung: ${formatToGerman(d,3)} μSv/h</p><p>TKZ: ${formatToGerman(t,1)}</p>`;
    res.classList.remove('hidden');
}

// --- 6. Aktivität ---
function toggleManualGammaH(){
    const select = document.getElementById('dosisleistungskonstante-select');
    const manual = document.getElementById('dosisleistungskonstante-manuell');
    if(select.value==='manuell'){manual.classList.remove('hidden');manual.value='';manual.focus();}
    else{manual.classList.add('hidden');}
}
document.getElementById('dosisleistungskonstante-select').addEventListener('change',toggleManualGammaH);

function convertActivityToMBq(value, unit){
    switch(unit){
        case 'Bq': return value/1e6;
        case 'kBq': return value/1e3;
        case 'MBq': return value;
        case 'GBq': return value*1e3;
        default: return 0;
    }
}

function calculateAktivitaet(){
    const A = getInputValue('aktivitaet-wert');
    const unit = document.getElementById('aktivitaet-einheit').value;
    const gammaSel = document.getElementById('dosisleistungskonstante-select').value;
    let Gamma = gammaSel==='manuell'? getInputValue('dosisleistungskonstante-manuell') : parseFloat(gammaSel);
    const r = getInputValue('abstand-aktivitaet');
    const res = document.getElementById('result-aktivitaet');

    if(isNaN(A)||isNaN(Gamma)||isNaN(r)||A<=0||Gamma<=0||r<=0){
        res.classList.remove('hidden'); res.classList.add('error'); res.innerHTML='Alle Felder mit gültigen Werten ausfüllen'; return;
    }
    res.classList.remove('error');

    const activityMBq = convertActivityToMBq(A,unit);
    const H = Gamma * activityMBq / (r*r);
    res.innerHTML=`<div class="result-title">Dosisleistung:</div><div class="result-value">${formatToGerman(H,3)} μSv/h</div>`;
    res.classList.remove('hidden');
}

// --- 7. Schutzwert ---
function calculateSchutzwert(){
    const ohne = getInputValue('dl-ohne-abschirmung');
    const mit = getInputValue('dl-mit-abschirmung');
    const res = document.getElementById('result-schutzwert');

    if(isNaN(ohne)||isNaN(mit)||ohne<=0||mit<=0){res.classList.remove('hidden');res.classList.add('error');res.innerHTML='Bitte gültige Werte eingeben'; return;}
    res.classList.remove('error');
    const f = ohne/mit;
    res.innerHTML=`<div class="result-title">Schutzfaktor:</div><div class="result-value">${formatToGerman(f,2)}</div>`;
    res.classList.remove('hidden');
}

// --- Kein Zoom auf iOS/Android beim Input ---
document.querySelectorAll('input[type="number"],input[type="text"]').forEach(input=>{
    input.addEventListener('focus',()=>{input.style.fontSize='16px';});
});
