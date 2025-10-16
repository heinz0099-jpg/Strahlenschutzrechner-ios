// --- Screens & Buttons ---
const screens = {
    distanz: document.getElementById('screen-distanz'),
    einheit: document.getElementById('screen-einheit'),
    dauer: document.getElementById('screen-dauer'),
    'total-dose': document.getElementById('screen-total-dose'),
    tkz: document.getElementById('screen-tkz'),
    aktivitaet: document.getElementById('screen-aktivitaet'),
    schutzwert: document.getElementById('screen-schutzwert')
};

const navButtons = {
    distanz: document.getElementById('nav-distanz'),
    einheit: document.getElementById('nav-einheit'),
    dauer: document.getElementById('nav-dauer'),
    'total-dose': document.getElementById('nav-total-dose'),
    tkz: document.getElementById('nav-tkz'),
    aktivitaet: document.getElementById('nav-aktivitaet'),
    schutzwert: document.getElementById('nav-schutzwert')
};

for (const key in navButtons) {
    navButtons[key].addEventListener('click', () => showScreen(key));
}

function showScreen(screenId) {
    for (const id in screens) {
        screens[id].classList.toggle('hidden', id !== screenId);
        navButtons[id].classList.toggle('active', id === screenId);
    }
}

// --- Hilfsfunktionen ---
function getInputValue(id) {
    const el = document.getElementById(id);
    let val = el.value || el.placeholder;
    val = val.replace(',', '.');
    const num = parseFloat(val);
    return isNaN(num) ? NaN : num;
}

function formatToGerman(num, precision = 3) {
    return num.toLocaleString('de-DE', { useGrouping: false, minimumFractionDigits: precision, maximumFractionDigits: precision });
}

// --- 1. Abstand ---
function calculateDistanz() {
    const h1 = getInputValue('dosisleistung1');
    const r1 = getInputValue('abstand1');
    const r2 = getInputValue('abstand2');
    const resultBox = document.getElementById('result-distanz');

    if (isNaN(h1) || isNaN(r1) || isNaN(r2) || h1 <= 0 || r1 <= 0 || r2 <= 0) {
        resultBox.innerHTML = 'Bitte alle Felder korrekt ausfüllen.';
        return;
    }
    const h2 = h1 * (r1*r1)/(r2*r2);
    resultBox.innerHTML = `Neue Dosisleistung: ${formatToGerman(h2,3)} μSv/h`;
}

// --- 2. Einheiten ---
function calculateEinheit() {
    const wert = getInputValue('wert-einheit');
    const quelle = document.getElementById('einheit-quelle').value;
    const resultBox = document.getElementById('result-einheit');
    if (isNaN(wert)) { resultBox.innerHTML='Bitte gültigen Wert'; return; }

    let inMicro;
    if (quelle==='micro') inMicro=wert;
    else if (quelle==='milli') inMicro=wert*1000;
    else inMicro=wert*1000000;

    resultBox.innerHTML = `μSv/h: ${formatToGerman(inMicro,3)}, mSv/h: ${formatToGerman(inMicro/1000,3)}, Sv/h: ${formatToGerman(inMicro/1000000,6)}`;
}

// --- 3. Dauer ---
function calculateDauer() {
    const dosis = getInputValue('dosisleistung-dauer');
    const ziel = getInputValue('zieldosis-dauer');
    const resultBox = document.getElementById('result-dauer');
    if (isNaN(dosis)||isNaN(ziel)||dosis<=0||ziel<=0){ resultBox.innerHTML='Bitte alle Felder korrekt ausfüllen.'; return; }
    const dauer=h=ziel/dosis;
    resultBox.innerHTML=`Maximale Aufenthaltsdauer: ${formatToGerman(ziel/dosis,2)} Stunden`;
}

// --- 4. Gesamtdosis ---
function calculateTotalDose() {
    const dosis = getInputValue('dosisleistung-total');
    const stunden = parseFloat(document.getElementById('stunden-total').value||0);
    const minuten = parseFloat(document.getElementById('minuten-total').value||0);
    const sekunden = parseFloat(document.getElementById('sekunden-total').value||0);
    const total=dosis*(stunden+minuten/60+sekunden/3600);
    document.getElementById('result-total-dose').innerHTML=`Gesamtdosis: ${formatToGerman(total,3)} μSv`;
}

// --- 5. TKZ ---
function calculateTKZ() {
    const tkz=getInputValue('eingabe-tkz');
    const dl=getInputValue('eingabe-tkz-dl');
    let res;
    if(!isNaN(dl)&&dl>0){ res=`TKZ: ${Math.ceil(dl*10)/10}, DL: ${formatToGerman(dl,3)}`;}
    else if(!isNaN(tkz)&&tkz>0){ res=`TKZ: ${tkz}, DL: ${formatToGerman(tkz,3)}`;}
    else{res='Bitte Wert eingeben';}
    document.getElementById('result-tkz').innerHTML=res;
}

// --- 6. Aktivität ---
function calculateAktivitaet() {
    const A=getInputValue('aktivitaet-wert');
    const unit=document.getElementById('aktivitaet-einheit').value;
    let GammaH=parseFloat(document.getElementById('dosisleistungskonstante-select').value);
    if(document.getElementById('dosisleistungskonstante-select').value==='manuell'){
        GammaH=getInputValue('dosisleistungskonstante-manuell');
    }
    const r=getInputValue('abstand-aktivitaet');
    const A_MBq=(unit==='Bq')?A/1000000:(unit==='kBq')?A/1000:(unit==='MBq')?A:A*1000;
    const dl=(A_MBq*GammaH)/(r*r);
    document.getElementById('result-aktivitaet').innerHTML=`Dosisleistung: ${formatToGerman(dl,3)} μSv/h`;
}

// --- 7. Schutzwert ---
function calculateSchutzwert() {
    const dl0=getInputValue('dl-ohne-abschirmung');
    const dlx=getInputValue('dl-mit-abschirmung');
    const s=(dlx===0)?'∞':formatToGerman(dl0/dlx,2);
    document.getElementById('result-schutzwert').innerHTML=`Schutzwert S: ${s}`;
}

// Initial Screen
window.addEventListener('load',()=>showScreen('distanz'));
