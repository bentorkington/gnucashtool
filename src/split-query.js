/** @typedef {import('./book')} Book */
/** @typedef {import('./split')} Split */
/** @typedef {import('./account')} Account */

/**
 * Representation of a monetary amount as a fraction, e.g: '175/100' to mean $1.75
 *  @typedef {string} RationalValue
 * */

module.exports = class SplitQuery {
  /**
   * @param {Book} book
   * @param {Split[]} splits
   */
  constructor(book, splits) {
    /** @type {Book} */
    this.book = book;
    /** @type {Split[]} */
    this.splits = splits;
  }

  /**
   * @param {Account} account
   * @returns {SplitQuery}
   */
  withAccountId(account) {
    return new SplitQuery(this.book, this.splits.filter((s) => s.account === account.id));
  }

  withAccountName(name) {
    return this.withAccountId(this.book.findAccountByName(name));
  }

  /**
   * @param {RationalValue} value
   * @returns {SplitQuery}
   */
  withValue(value) {
    return new SplitQuery(this.book, this.splits.filter((s) => s.value === value));
  }

  setAccount(id) {
    return this;
  }

  /**
   * @callback SplitAction
   * @param {Split} split
   */

  /**
   * @param {SplitAction} action
   * @returns {SplitQuery}
   */
  do(action) {
    this.splits.forEach((split) => action(split));
    return this;
  }

  /**
   * Get the number of splits remaining in the query
   * @returns {Number} The number of splits remaining in the query
   */
  count() {
    return this.splits.length;
  }
};
