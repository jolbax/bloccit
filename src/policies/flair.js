const ApplicationPolicy = require("./application");

module.exports = class FlairPolicy extends ApplicationPolicy {
  new() {
    return this.user != null && (this._isOwner() || this._isAdmin());
  }

  create() {
    return this.new();
  }

  update() {
    return super.edit();
  }

  destroy() {
    return this.update();
  }
};
