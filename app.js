// --- HILFSFUNKTIONEN ---

// Dezimalpunkt für Berechnung, Komma für Anzeige
function formatToGerman(number, precision) {
    return number.toLocaleString('de-DE', { useGrouping: false, minimumFractionDigits: precision, maximumFractionDigits: precision });
}

function getInputValue(elementId) {
    const el = document.getElementById(elementId);
    let val = el.value || el.placeholder;
    val = val.replace(',', '.');
    const num = parseFloat(val);
    return isNaN(num) ? NaN : num;
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
        if(screens[id]) screens[id].classList.toggle('hidden', id !== screenId);
        if(navButtons[id]) navButtons[id].classList.toggle('active', id === screenId);
    }
}

window.addEventListener('load', () => showScreen('distanz'));

// --- 1. Quadratisches Abstandsgesetz ---
function calculateDistanz() {
    const h1 = getInputValue('dosisleistung1');
    const r1 = getInputValue('abstand1');
    const r2 = getInputValue('abstand2');
    const resultBox = document.getElementById('result-distanz');
    if (isNaN(h1) || isNaN(r1) || isNaN(r2) || h1<=0 || r1<=0 || r2<=0) {
        resultBox.classList.remove('hidden'); resultBox.classList.add('error');
        resultBox.innerHTML = 'Bitte alle Felder mit gültigen Werten (>0) ausfüllen.';
        return;
    }
    const h2 = h1 * (r1*r1)/(r2*r2);
    resultBox.classList.remove('error');
    resultBox.innerHTML = `<div class="result-title">Neue Dosisleistung (H2):</div>
                           <div class="result-value">${formatToGerman(h2,3)} μSv/h</div>`;
    resultBox.classList.remove('hidden');
}

// --- 2. Einheiten-Umrechner ---
function calculateEinheit() {
    const wert = getInputValue('wert-einheit');
    const quelle = document.getElementById('einheit-quelle').value;
    const resultBox = document.getElementById('result-einheit');
    if(isNaN(wert)){resultBox.classList.remove('hidden'); resultBox.classList.add('error'); resultBox.innerHTML='Bitte einen gültigen Wert eingeben.'; return;}
    resultBox.classList.remove('error');
    let micro;
    switch(quelle){
        case 'micro': micro = wert; break;
        case 'milli': micro = wert*1000; break;
        case 'sievert': micro = wert*1000000; break;
    }
    resultBox.innerHTML = `<div class="result-title mb-2">Ergebnis (pro Stunde):</div>
                           <p><strong>μSv:</strong> ${formatToGerman(micro,6)} μSv/h</p>
                           <p><strong>mSv:</strong> ${formatToGerman(micro/1000,6)} mSv/h</p>
                           <p><strong>Sv:</strong> ${formatToGerman(micro/1000000,9)} Sv/h</p>`;
    resultBox.classList.remove('hidden');
}

// --- 3. Aufenthaltsdauer ---
function calculateDauer() {
    const dosis = getInputValue('dosisleistung-dauer');
    const ziel = getInputValue('zieldosis-dauer');
    const res = document.getElementById('result-dauer');
    if(isNaN(dosis)||isNaN(ziel)||dosis<=0||ziel<=0){res.classList.remove('hidden'); res.classList.add('error'); res.innerHTML='Bitte alle Felder korrekt ausfüllen.'; return;}
    const dauerStunden = ziel/dosis;
    const stunden = Math.floor(dauerStunden);
    const minutenGes = (dauerStunden-stunden)*60;
    const minuten = Math.floor(minutenGes);
    const sekunden = Math.round((minutenGes-minuten)*60);
    res.classList.remove('error');
    res.innerHTML = `<div class="result-title">Maximale Aufenthaltsdauer:</div>
                     <div class="result-value">${formatToGerman(dauerStunden,2)} Stunden</div>
                     <div style="font-size:0.875rem; margin-top:0.25rem;">(${stunden} Stunden, ${minuten} Minuten, ${sekunden} Sekunden)</div>`;
    res.classList.remove('hidden');
}

// --- 4. Gesamtdosis ---
function calculateTotalDose() {
    const dosis = getInputValue('dosisleistung-total');
    const stunden = parseFloat(document.getElementById('stunden-total').value || 0);
    const minuten = parseFloat(document.getElementById('minuten-total').value || 0);
    const sek = parseFloat(document.getElementById('sekunden-total').value || 0);
    const res = document.getElementById('result-total-dose');
    if(isNaN(dosis)||dosis<=0){res.classList.remove('hidden'); res.classList.add('error'); res.innerHTML='Dosisleistung muss >0 sein.'; return;}
    const gesamt = stunden + minuten/60 + sek/3600;
    const total = dosis*gesamt;
    res.classList.remove('error');
    res.innerHTML = `<div class="result-title">Aufgenommene Gesamtdosis:</div>
                     <div class="result-value">${formatToGerman(total,3)} μSv</div>`;
    res.classList.remove('hidden');
}

// --- 5. TKZ ---
function calculateTKZ() {
    const tkz = getInputValue('eingabe-tkz');
    const dl = getInputValue('eingabe-tkz-dl');
    const res = document.getElementById('result-tkz');
    if((isNaN(tkz)&&isNaN(dl))||(isNaN(tkz)&&dl<=0)||(isNaN(dl)&&tkz<=0)){res.classList.remove('hidden'); res.classList.add('error'); res.innerHTML='Mindestens ein Wert >0 erforderlich.'; return;}
    let resultTKZ,resultDL;
    if(!isNaN(dl)&&dl>0){resultDL=dl; resultTKZ=Math.ceil(dl*10)/10;}
    else {resultTKZ=tkz; resultDL=tkz;}
    res.classList.remove('error');
    res.innerHTML = `<div class="result-title">Ergebnisse:</div>
                     <p><strong>Dosisleistung (DL 1m):</strong> ${formatToGerman(resultDL,3)} μSv/h</p>
                     <p><strong>Transportkennzahl (TKZ):</strong> ${formatToGerman(resultTKZ,1)}</p>`;
    res.classList.remove('hidden');
}

// --- 6. Aktivität ---
function toggleManualGammaH() {
    const sel = document.getElementById('dosisleistungskonstante-select');
    const man = document.getElementById('dosisleistungskonstante-manuell');
    if(sel.value==='manuell'){man.classList.remove('hidden'); man.value=''; man.focus();} 
    else {man.classList.add('hidden');}
}

function convertActivityToMBq(value, unit){
    switch(unit){case'Bq':return value/1000000;case'kBq':return value/1000;case'MBq':return value;case'GBq':return value*1000;default:return 0;}
}

function calculateAktivitaet(){
    const A=getInputValue('aktivitaet-wert');
    const unit=document.getElementById('aktivitaet-einheit').value;
    const gammaSel=document.getElementById('dosisleistungskonstante-select').value;
    const res=document.getElementById('result-aktivitaet');
    const r=getInputValue('abstand-aktivitaet');
    let gamma;
    if(gammaSel==='manuell'){gamma=getInputValue('dosisleistungskonstante-manuell');} 
    else {gamma=parseFloat(gammaSel);}
    if(isNaN(A)||isNaN(gamma)||isNaN(r)||A<0||gamma<=0||r<=0){res.classList.remove('hidden'); res.classList.add('error'); res.innerHTML='Bitte alle Felder korrekt ausfüllen (>0 für GammaH und Abstand).'; return;}
    const A_MBq=convertActivityToMBq(A,unit);
    const dl=(A_MBq*gamma)/(r*r);
    res.classList.remove('error');
    res.innerHTML=`<div class="result-title">Berechnete Dosisleistung:</div>
                   <div class="result-value">${formatToGerman(dl,3)} μSv/h</div>
                   <div style="font-size:0.875rem; margin-top:0.25rem;">Verwendete Γ-Konstante: ${formatToGerman(gamma,5)} μSv·m²/h·MBq</div>`;
    res.classList.remove('hidden');
}

// --- 7. Schutzwert ---
function calculateSchutzwert(){
    const ohne=getInputValue('dl-ohne-abschirmung');
    const mit=getInputValue('dl-mit-abschirmung');
    const res=document.getElementById('result-schutzwert');
    if(isNaN(ohne)||isNaN(mit)||ohne<=0||mit<0){res.classList.remove('hidden'); res.classList.add('error'); res.innerHTML='Bitte alle Felder korrekt ausfüllen (>0 ohne Abschirmung).'; return;}
    if(mit>=ohne){res.classList.remove('hidden'); res.classList.add('error'); res.innerHTML='Mit Abschirmung darf nicht größer als ohne sein.'; return;}
    const sw=ohne/mit;
    res.classList.remove('error');
    res.innerHTML=`<div class="result-title">Schutzwert:</div>
                   <div class="result-value">${formatToGerman(sw,2)}</div>`;
    res.classList.remove('hidden');
}

// --- BUTTON MAPPING ---
const calcMap = {
    'calc-distanz': calculateDistanz,
    'calc-einheit': calculateEinheit,
    'calc-dauer': calculateDauer,
    'calc-total-dose': calculateTotalDose,
    'calc-tkz': calculateTKZ,
    'calc-aktivitaet': calculateAktivitaet,
    'calc-schutzwert': calculateSchutzwert
};

for(const id in calcMap){
    const btn=document.getElementById(id);
    if(btn) btn.addEventListener('click', calcMap[id]);
}

// GammaH manuell toggle
const gammaSel = document.getElementById('dosisleistungskonstante-select');
if(gammaSel) gammaSel.addEventListener('change', toggleManualGammaH);

// --- ZOOM PREVENTION FÜR MOBILE ---
document.querySelectorAll('input[type="number"], input[type="text"]').forEach(input => {
    input.style.fontSize='16px';
});
