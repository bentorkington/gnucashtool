/**
 * @typedef {{
 *    "@type": string,
 *    "#text": string,
 *    gdate: string,
 * }} SlotValue
 */

/**
 * Parse a `SlotValue` object
 * @param {SlotValue}} v The value object to parse
 * @returns {Date | string}
 */
function parseSlot(v) {
  switch (v['@_type']) {
    case 'gdate':
      return new Date(v.gdate);
    default:
      return v['#text'];
  }
}

/**
 * 
 * @param {{'slot:key': string, 'slot:value': SlotValue}[]} s An array of key-value pairs
 * @returns {Object.<string, Any>}
 */
function parseSlots(s) {
  return Object.fromEntries(s.map((a) => [a['slot:key'], parseSlot(a['slot:value'])]));
}

module.exports = {
  parseSlots,
};
