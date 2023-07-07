const SplitQuery = require('./split-query');

/** @typedef {import('./book')} Book */
/** @typedef {import('./transaction')} Transaction */
/** @typedef {import('./account')} Account */

/**
 * Representation of a monetary amount as a fraction, e.g: '175/100' to mean $1.75
 *  @typedef {string} RationalValue
 * */

module.exports = class TransactionQuery {
  /**
   * @param {Book} book
   * @param {Transaction[]} transactions
   */
  constructor(book, transactions) {
    /** @type {Book} */
    this.book = book;
    /** @type {Transaction[]} */
    this.transactions = transactions;
  }

  withDateRange(from, to) {
    const fromDate = new Date(from);
    const toDate = new Date(to);

    const txns = this.transactions
      .filter((txn) => txn.datePosted >= fromDate && txn.datePosted <= toDate);

    return new TransactionQuery(this.book, txns);
  }

  /**
   * @callback TransactionSplitsCallback
   * @param {SplitQuery} splitQuery
   * @returns {SplitQuery}
   */

  /**
   * @param {TransactionSplitsCallback} callback
   */
  splitQuery(callback) {
    this.transactions.forEach((tx) => callback(new SplitQuery(this.book, tx.splits)));
    return this;
  }

  /**
   * @param {TransactionSplitsCallback} callback
   */
  havingSplits(callback) {
    const txns = this.transactions
      .filter((tx) => callback(new SplitQuery(this.book, tx.splits)).count() > 0);

    return new TransactionQuery(this.book, txns);
  }

  /**
   * @callback TransactionAction
   * @param {Transaction} transaction
   */

  /**
   * @param {TransactionAction} action
   * @returns {TransactionQuery}
   */
  do(action) {
    this.transactions.forEach((split) => action(split));
    return this;
  }

  /**
   * Get the number of transactions remaining in the query
   * @returns {Number} the number of transations remaining in the query
   */
  count() {
    return this.transactions.length;
  }
};
