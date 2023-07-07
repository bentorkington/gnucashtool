const fs = require('fs-extra');
const gnucash = require('../index');

// read the contents of an uncompressed XML file
const buffer = fs.readFileSync('simple.gnucash');
// … and parse into a `Book` object
const book = gnucash.Book.deserialize(buffer);

// Find all the transactions in 'Income:Paper Run' for $50.00 between April 1 and June 3
// and move them to the 'Income:Flour Mill' account
book.transactionQuery()
  .withDateRange('2022-04-01', '2022-06-30')
  .havingSplits((splits) => splits
    .withAccountName('Income:Paper Run')
    .withValue('-5000/100')
    .setAccount(book.findAccountByName('Income:Flour Mill')));

// …and save it to a new file
fs.writeFileSync('simple-out.gnucash', book.serialize());
