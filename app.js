// --- HILFSFUNKTIONEN ---
function formatToGerman(number, precision) {
    return number.toLocaleString('de-DE', {
        useGrouping: false,
        minimumFractionDigits: precision,
        maximumFractionDigits: precision
    });
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
        screens[id].classList.toggle('hidden', id !== screenId);
        navButtons[id].classList.toggle('active', id === screenId);
    }
}

window.addEventListener('load', () => showScreen('distanz'));

// --- BERECHNUNGEN ---

function calculateDistanz() {
    const h1 = getInputValue('dosisleistung1');
    const r1 = getInputValue('abstand1');
    const r2 = getInputValue('abstand2');
    const resultBox = document.getElementById('result-distanz');

    if ([h1,r1,r2].some(v=>isNaN(v)||v<=0)){
        resultBox.className = 'result-box error';
        resultBox.innerHTML='Bitte alle Felder mit gültigen Werten (>0) ausfüllen.';
        return;
    }
    const h2 = h1 * (r1*r1)/(r2*r2);
    resultBox.className='result-box';
    resultBox.innerHTML=`<div class="result-title">Neue Dosisleistung (H2):</div>
                         <div class="result-value">${formatToGerman(h2,3)} μSv/h</div>`;
}

function calculateEinheit() {
    const wert = getInputValue('wert-einheit');
    const quelle = document.getElementById('einheit-quelle').value;
    const resultBox = document.getElementById('result-einheit');
    if(isNaN(wert)){resultBox.className='result-box error';resultBox.innerHTML='Bitte gültigen Wert eingeben.';return;}
    let inMicro;
    switch(quelle){
        case 'micro': inMicro=wert;break;
        case 'milli': inMicro=wert*1000;break;
        case 'sievert': inMicro=wert*1000000;break;
        default: inMicro=0;
    }
    const milli=inMicro/1000;
    const sv=inMicro/1000000;
    resultBox.className='result-box';
    resultBox.innerHTML=`<div class="result-title mb-2">Ergebnis:</div>
                         <p><strong>μSv/h:</strong> ${formatToGerman(inMicro,6)}</p>
                         <p><strong>mSv/h:</strong> ${formatToGerman(milli,6)}</p>
                         <p><strong>Sv/h:</strong> ${formatToGerman(sv,9)}</p>`;
}

function calculateDauer() {
    const dosis=getInputValue('dosisleistung-dauer');
    const ziel=getInputValue('zieldosis-dauer');
    const resultBox=document.getElementById('result-dauer');
    if(isNaN(dosis)||isNaN(ziel)||dosis<=0||ziel<=0){resultBox.className='result-box error';resultBox.innerHTML='Bitte gültige Werte (>0)';return;}
    const dauer=ziel/dosis;
    const stunden=Math.floor(dauer);
    const minuten=Math.floor((dauer-stunden)*60);
    const sekunden=Math.round(((dauer-stunden)*60-minuten)*60);
    resultBox.className='result-box';
    resultBox.innerHTML=`<div class="result-title">Maximale Aufenthaltsdauer:</div>
                         <div class="result-value">${formatToGerman(dauer,2)} Stunden</div>
                         <div style="font-size:0.875rem;">(${stunden}h ${minuten}min ${sekunden}s)</div>`;
}

function calculateTotalDose(){
    const dosis=getInputValue('dosisleistung-total');
    const stunden=parseFloat(document.getElementById('stunden-total').value||0);
    const minuten=parseFloat(document.getElementById('minuten-total').value||0);
    const sekunden=parseFloat(document.getElementById('sekunden-total').value||0);
    const resultBox=document.getElementById('result-total-dose');
    if(isNaN(dosis)||dosis<=0||[stunden,minuten,sekunden].some(v=>isNaN(v))){resultBox.className='result-box error';resultBox.innerHTML='Bitte gültige Werte eingeben';return;}
    const gesamt=stunden+(minuten/60)+(sekunden/3600);
    const total=dosis*gesamt;
    resultBox.className='result-box';
    resultBox.innerHTML=`<div class="result-title">Aufgenommene Gesamtdosis:</div>
                         <div class="result-value">${formatToGerman(total,3)} μSv</div>`;
}

function calculateTKZ(){
    const tkz=getInputValue('eingabe-tkz');
    const dl=getInputValue('eingabe-tkz-dl');
    const resultBox=document.getElementById('result-tkz');
    if((isNaN(tkz)&&isNaN(dl))||(dl<=0&&isNaN(tkz))||(tkz<=0&&isNaN(dl))){resultBox.className='result-box error';resultBox.innerHTML='Mindestens ein gültiger Wert >0';return;}
    let tkzVal, dlVal;
    if(!isNaN(dl)&&dl>0){dlVal=dl;tkzVal=Math.ceil(dl*10)/10;}
    else {tkzVal=tkz;dlVal=tkz;}
    resultBox.className='result-box';
    resultBox.innerHTML=`<div class="result-title">Ergebnisse:</div>
                         <p><strong>Dosisleistung DL:</strong> ${formatToGerman(dlVal,3)} μSv/h</p>
                         <p><strong>TKZ:</strong> ${formatToGerman(tkzVal,1)}</p>`;
}

function toggleManualGammaH(){
    const sel=document.getElementById('dosisleistungskonstante-select');
    const manual=document.getElementById('dosisleistungskonstante-manuell');
    if(sel.value==='manuell'){manual.classList.remove('hidden');manual.value='';manual.focus();}
    else{manual.classList.add('hidden');}
}

function convertActivityToMBq(val,unit){
    switch(unit){case 'Bq': return val/1000000; case 'kBq': return val/1000; case 'MBq': return val; case 'GBq': return val*1000; default:return 0;}
}

function calculateAktivitaet(){
    const A=getInputValue('aktivitaet-wert');
    const unit=document.getElementById('aktivitaet-einheit').value;
    const gammaSel=document.getElementById('dosisleistungskonstante-select').value;
    let GammaH=gammaSel==='manuell'?getInputValue('dosisleistungskonstante-manuell'):parseFloat(gammaSel);
    const r=getInputValue('abstand-aktivitaet');
    const resultBox=document.getElementById('result-aktivitaet');
    if(isNaN(A)||isNaN(GammaH)||isNaN(r)||A<0||GammaH<=0||r<=0){resultBox.className='result-box error';resultBox.innerHTML='Bitte gültige Werte ausfüllen';return;}
    const A_MBq=convertActivityToMBq(A,unit);
    const dl=(A_MBq*GammaH)/(r*r);
    resultBox.className='result-box';
    resultBox.innerHTML=`<div class="result-title">Dosisleistung:</div>
                         <div class="result-value">${formatToGerman(dl,3)} μSv/h</div>
                         <div style="font-size:0.875rem;">Gamma-H: ${formatToGerman(GammaH,5)} μSv·m²/h·MBq</div>`;
}

function calculateSchutzwert(){
    const dl0=getInputValue('dl-ohne-abschirmung');
    const dlx=getInputValue('dl-mit-abschirmung');
    const resultBox=document.getElementById('result-schutzwert');
    if(isNaN(dl0)||dl0<=0||isNaN(dlx)||dlx<0){resultBox.className='result-box error';resultBox.innerHTML='Bitte gültige Werte eingeben';return;}
    if(dlx===0){resultBox.className='result-box';resultBox.innerHTML=`<div class="result-title">Schutzwert:</div><div class="result-value">∞</div>`;return;}
    const s=dl0/dlx;
    resultBox.className='result-box';
    resultBox.innerHTML=`<div class="result-title">Schutzwert:</div><div class="result-value">${formatToGerman(s,2)}</div>`;
}

// --- BUTTONS EVENTLISTENER ---
document.getElementById('nav-distanz').addEventListener('click',()=>showScreen('distanz'));
document.getElementById('nav-einheit').addEventListener('click',()=>showScreen('einheit'));
document.getElementById('nav-dauer').addEventListener('click',()=>showScreen('dauer'));
document.getElementById('nav-total-dose').addEventListener('click',()=>showScreen('total-dose'));
document.getElementById('nav-tkz').addEventListener('click',()=>showScreen('tkz'));
document.getElementById('nav-aktivitaet').addEventListener('click',()=>showScreen('aktivitaet'));
document.getElementById('nav-schutzwert').addEventListener('click',()=>showScreen('schutzwert'));

if("serviceWorker"in navigator){navigator.serviceWorker.register("service-worker.js").then(()=>console.log("SW registriert")).catch(e=>console.log("SW Fehler",e));}
