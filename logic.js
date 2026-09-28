// Reglene for påmeldingen.

 
// Sjekk skjemaet. Gir en feilmelding per felt som er feil.
function finnFeil(data, pameldinger) {
  const feil = {};
 
  if (data.fornavn === '') feil.fornavn = 'Skriv inn fornavn.';
  if (data.etternavn === '') feil.etternavn = 'Skriv inn etternavn.';
  if (!data.epost.includes('@') || !data.epost.includes('.')) {
    feil.epost = 'Skriv inn en gyldig e-postadresse.';
  }
 
  if (![5, 10, 15].includes(data.km)) {
    feil.km = 'Velg en distanse.';
  } else if (pameldinger.some((p) => p.epost === data.epost && p.km === data.km)) {
    feil.epost = `Denne e-posten er allerede påmeldt ${data.km} km.`;
  }
 
  return feil;
}