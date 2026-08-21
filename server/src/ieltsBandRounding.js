// Official IELTS band rounding rule: always rounds UP to the nearest half
// band (.25 -> next half band, .75 -> next whole band; exact .0/.5 unchanged).
function roundToIELTSBand(value) {
  return Math.ceil(value * 2) / 2;
}

export { roundToIELTSBand };
