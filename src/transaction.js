const Split = require('./split');
const { parseSlots } = require('./helpers');

module.exports = class Transaction {
  constructor(xt) {
    this.xt = xt;
  }

  /**
   * The posted date of the transaction
   * @type {Date}
   */
  get datePosted() { return new Date(Date.parse(this.xt['trn:date-posted']['ts:date'])); }

  /**
   * The description of this tansaction
   * @type {string}
   */
  get description() { return this.xt['trn:description']; }

  /**
   * The splits for this transaction
   * @type {Split[]}
   */
  get splits() { return this.xt['trn:splits']['trn:split'].map((s) => new Split(s)); }

  /**
   * The slots for this transaction
   */
  get slots() { return parseSlots(this.xt['trn:slots'].slot); }
};
