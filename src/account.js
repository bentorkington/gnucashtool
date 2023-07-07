module.exports = class Account {
  constructor(xa) {
    this.id = xa['act:id']['#text'];
    this.name = xa['act:name'];
    this.type = xa['act:type'];
    if (xa['act:parent']) {
      this.parent = xa['act:parent']['#text'];
    }
  }
};
