module.exports = class Split {
  constructor(obj) {
    this.xmlObject = obj;
  }

  get id() { return this.xmlObject['split:id']['#text']; }

  get value() { return this.xmlObject['split:value']; }

  /**
   * The GUID of the account
   * @type {string}
   */
  get account() { return this.xmlObject['split:account']['#text']; }

  set account(id) { this.xmlObject['split:account']['#text'] = id; }

  get reconciledState() { return this.xmlObject['split:reconciled-state']; }

  get memo() { return this.xmlObject['split:memo']; }
};
