const { XMLParser, XMLBuilder } = require('fast-xml-parser');
const Account = require('./account');
const Transaction = require('./transaction');
const TransactionQuery = require('./transaction-query');

module.exports = class Book {
  constructor(jsonObject) {
    this.jsonObject = jsonObject;
    this.accounts = {};
    /** @type {Object.<string, Transaction>} */
    this.transactions = {};
    const xmlAccounts = jsonObject['gnc-v2']['gnc:book']['gnc:account'];
    const xmlTransactions = jsonObject['gnc-v2']['gnc:book']['gnc:transaction'];
    xmlAccounts.forEach((xa) => { this.accounts[xa['act:id']['#text']] = new Account(xa); });
    xmlTransactions.forEach((xt) => { this.transactions[xt['trn:id']['#text']] = new Transaction(xt); });
  }

  static alwaysXmlArray = [
    'gnc-v2.gnc:book.transaction.splits',
    'gnc-v2.gnc:book.gnc:transaction.trn:slots.slot',
    'gnc-v2.gnc:book.gnc:account.act:slots.slot',
  ];

  static options = {
    ignoreAttributes: false,
    isArray: (name, jpath) => Book.alwaysXmlArray.indexOf(jpath) !== -1,
  };

  /**
   * Parse a GNUCash XML document
   * @param {string} xmlData
   * @returns {Book} A `Book` object representing the GNUCash document
   */
  static deserialize(xmlData) {
    const parser = new XMLParser(Book.options);
    const jsonObj = parser.parse(xmlData);
    return new Book(jsonObj);
  }

  /**
   * Serialize to a GNUCash XML document
   * @return {string} an XML representation of this object
   */
  serialize() {
    const builder = new XMLBuilder(Book.options);
    return builder.build(this.jsonObject);
  }

  /**
   * Get the full path of an account
   * @param {Account} account
   * @returns {string[]} The path to the count as an array of strings
   */
  getAccountPath(account) {
    if (account.parent) {
      if (this.accounts[account.parent].parent) {
        return [...this.getAccountPath(this.accounts[account.parent]), account.name];
      }
      // parent is the root
      return [account.name];
    }
    // I am the root
    return [];
  }

  /**
   * Get the human-readable path of an account
   * @param {Account} account
   * @returns {string[]} The path to the count as an array of strings
   */
  getAccountName(account) {
    return this.getAccountPath(account).join(':');
  }

  /**
   * Find an account from its human-readable name
   * @param {string} name the name of the account as a set of colon-delimited names
   * @returns {?Account}
   */
  findAccountByName(name) {
    const accountId = Object.keys(this.accounts)
      .find((k) => this.getAccountName(this.accounts[k]) === name);
    return this.accounts[accountId];
  }

  /**
   * Perform a query on the book's transactions
   * @returns {TransactionQuery}
   */
  transactionQuery() {
    return new TransactionQuery(this, Object
      .keys(this.transactions)
      .map((key) => this.transactions[key]));
  }
};
