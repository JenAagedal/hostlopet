// Kobler logikken til nettsiden, leser skjemaet,
// lagrer i localStorage og viser resultatet.
// Bruker innerText (ikke innerHTML) når jeg viser det brukeren har skrevet, slik at det blir aldri tolket som HTML


const skjema = document.getElementById('skjema');
const kvittering = document.getElementById('kvittering');

// Henter påmeldingene. Er det ingenting der, eller dataene er ødelagte, brukes en tom liste.
function hentPameldinger() {
  try {
    return JSON.parse(localStorage.getItem('pameldinger')) || [];
  } catch {
    return [];
  }
}

// Lagrer listen med påmeldinger i localStorage
function lagrePameldinger(pameldinger) {
  localStorage.setItem('pameldinger', JSON.stringify(pameldinger));
}
 // Viser feilmeldingen fra finnFeil
function visFeil(feil) {
  for (const felt of ['km', 'fornavn', 'etternavn', 'epost']) {
    document.getElementById(`feil-${felt}`).innerText = feil[felt] || '';
  }
}

// Vis alle som er påmeldt, med distanse
function visDeltakere() {
  const liste = document.getElementById('liste');
  const deltakere = hentPameldinger();

// Tøm listen først, så ingen står der to ganger når den fylles på nytt
  liste.replaceChildren();

// Ingen påmeldte, vis melding og avslutt fuksjon
  if (deltakere.length === 0) {
    const li = document.createElement('li');
    li.innerText = 'Ingen påmeldte ennå.';
    liste.append(li);
    return;
  }
// Lag en liste over påmeldte men ikke vis epostadresse
  for (const p of deltakere) {
    const li = document.createElement('li');
    li.innerText = `Nr. ${p.startnummer}: ${p.fornavn} ${p.etternavn} (${p.km} km)`;
    liste.append(li);
  }
}

skjema.addEventListener('submit', (e) => {
  e.preventDefault();
 
//Les skjemaet og rydd dataene:
  const data = {
    km: Number(document.getElementById('km').value),  // gjør "10" (tekst) om til 10 (tall)
    fornavn: document.getElementById('fornavn').value.trim(),   //trim() fjerner mellomrom i starten og slutten
    etternavn: document.getElementById('etternavn').value.trim(),
    epost: document.getElementById('epost').value.trim().toLowerCase()   //toLowerCase() gjør at xxx@eksempel.no og XXX@eksempel.no regnes som samme e-post
  };

//Sjekk reglene i logic.js og vis eventuelle feil

  const pameldinger = hentPameldinger();
  const feil = finnFeil(data, pameldinger);

  visFeil(feil);
  // Finnes det minst én feil så blir ingenting  lagret
  if (Object.keys(feil).length) return;

  // Lag den nye påmeldingen: startnummer + alle feltene fra skjemaet (...data).
  // Antall påmeldte + 1 er alltid unikt, fordi påmeldinger bare kan slettes alle samtidig
  const ny = {
    startnummer: pameldinger.length + 1,
    ...data // alle feltene fra data
  };

  pameldinger.push(ny);
  lagrePameldinger(pameldinger);

  //Vis kvitteringen med startnummeret, skjul skjemaet og oppdater listen
  document.getElementById('startnummer').innerText = ny.startnummer;

  skjema.hidden = true;
  kvittering.hidden = false;

  visDeltakere();
});
// Knapper
// «Meld på en til»: tøm skjemaet, fjern gamle feil og vis skjemaet igjen
document.getElementById('ny').addEventListener('click', () => {
  skjema.reset();
  visFeil({});
  skjema.hidden = false;
  kvittering.hidden = true;
});
// «Slett alle påmeldinger»: fjern alt som er lagret og oppdater listen
document.getElementById('slett').addEventListener('click', () => {
  localStorage.removeItem('pameldinger');
  visDeltakere();
});
// Start
// Vis lagrede påmeldinger med en gang siden åpnes
visDeltakere();