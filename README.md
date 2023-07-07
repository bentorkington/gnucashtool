# gnucashtool

Parses GNUCash XML documents for running queries and performing bulk updates

## Why?

For as long as I've been using GNUCash, people have been crying out for a way to bulk-edit transactions, usually because they've decided they need to restructure the way they represent transactions and need to separate a group of them out to a new account long after they've been entered / imported.

It's painfully clear the GNUCash devs have no intention of implementing this feature. Yes, once you've got your cashbook set up properly (read: have already learned this lesson the hard way) the need to do this generally lessens, but until you have, needing to edit 50+ transactions manually is tedious and error prone. Every time I've done it I've ended up sending at least one transaction to the wrong account, or changing the wrong split.

## Warning

Always make a backup of your GNUCash file before using this. It is not widely tested. It might break on complicated cashbooks. It might fail in subtle ways. This is just a tool I made to get me out of a jam, and I'm sharing it in case it can help you too.

Don't just make a backup. Check your trial balances before and after using this tool to make sure *only* the changes you made have been applied.

## Quick start

You'll need `Node.js` and `npm` installed.

Save your GNUCash book as an *uncompressed* XML file. You can turn off compression in `GNUCash Preferences -> General -> Compress Files`

Clone this repo, and copy your cashbook to the `examples` folder. Edit the sample `example.js` file with the name of your file, and modify the query to suit your situation.

## Example

A simple example cashbook is in `examples/simple.gnucash`. The person has two source of income: $20.00 per week from a paper run, and $50.00 per week from a flour mill. They want to keep these sources of income in two separate accounts: `Income:Paper Run` and `Income:Flour Mill`.

Unfortunately, some of the transactions from the Flour Mill are still mixed in with those from the Paper Run. We want to move only those transactions to the correct account:

```js
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
```

## I got here from Google trying find out how to do bulk-edit transactions in GNUCash, but I don't understand any of this

Sorry, this is just a simple tool I made to get myself out of a jam, not a fully-fledged tool with a nice user interface.

Maybe one day someone will make one using this library. Until then, maybe you can find someone familiar with Javascript to help you.
