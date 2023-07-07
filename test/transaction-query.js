/* eslint-env mocha */
const fs = require('fs-extra');
const { expect } = require('chai');
const { Book } = require('../index');

/**
 * @typedef {import('../src/transaction-query')} TransactionQuery
 */

describe('transaction query', () => {
  /** @type {TransactionQuery} */
  let query;

  before(() => {
    const book = Book.deserialize(fs.readFileSync('examples/simple.gnucash'));
    query = book.transactionQuery();
  });

  it('starts with all transactions', () => {
    expect(query.count()).to.equal(20);
  });

  it('withDateRange() works', () => {
    expect(query.withDateRange('2022-04-01', '2022-04-30').count()).to.equal(10);
  });

  it('havingSplit() filter works', () => {
    expect(query.havingSplits((sp) => sp.withAccountName('Income:Paper Run')).count()).to.equal(13);
  });
});
