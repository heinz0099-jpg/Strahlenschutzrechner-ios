// --- Globale Helfer ---
function formatToGerman(number, precision){return number.toLocaleString('de-DE',{useGrouping:false,minimumFractionDigits:precision,maximumFractionDigits:precision});}
function getInputValue(id){let el=document.getElementById(id);let val=el.value||el.placeholder;val=val.replace(',','.');let num=parseFloat(val);return isNaN(num)?NaN:num;}

// --- Navigation ---
const screens={
'distanz':document.getElementById('screen-distanz'),
'einheit':document.getElementById('screen-einheit'),
'dauer':document.getElementById('screen-dauer'),
'total-dose':document.getElementById('screen-total-dose'),
'tkz':document.getElementById('screen-tkz'),
'aktivitaet':document.getElementById('screen-aktivitaet'),
'schutzwert':document.getElementById('screen-schutzwert')
};
const navButtons={
'distanz':document.getElementById('nav-distanz'),
'einheit':document.getElementById('nav-einheit'),
'dauer':document.getElementById('nav-dauer'),
'total-dose':document.getElementById('nav-total-dose'),
'tkz':document.getElementById('nav-tkz'),
'aktivitaet':document.getElementById('nav-aktivitaet'),
'schutzwert':document.getElementById('nav-schutzwert')
};
function showScreen(id){
for(const key in screens){if(screens[key]){screens[key].classList.add('hidden');}if(navButtons[key]){navButtons[key].classList.remove('active');}}
if(screens[id]) screens[id].classList.remove('hidden');
if(navButtons[id]) navButtons[id].classList.add('active');
}
window.addEventListener('load',()=>{showScreen('distanz');for(const id in navButtons){navButtons[id].addEventListener('click',()=>showScreen(id));}});

// --- Berechnungsbutton Listener ---
document.getElementById('calc-distanz').addEventListener('click',calculateDistanz);
// gleiche Struktur für die anderen: calc-einheit, calc-dauer, calc-total-dose, calc-tkz, calc-aktivitaet, calc-schutzwert
// ... hier alle Funktionen wie vorher implementieren ...

// --- Beispiel für Distanz-Berechnung ---
function calculateDistanz(){
const H1=getInputValue('dosisleistung1');
const r1=getInputValue('abstand1');
const r2=getInputValue('abstand2');
const resBox=document.getElementById('result-distanz');
if(isNaN(H1)||isNaN(r1)||isNaN(r2)||r1===0||r2===0){resBox.textContent="Ungültige Eingabe!";resBox.classList.add('error');resBox.classList.remove('hidden');return;}
const H2=H1*(r1*r1)/(r2*r2);
resBox.textContent="H2 = "+formatToGerman(H2,2)+" μSv/h";resBox.classList.remove('error');resBox.classList.remove('hidden');
}
