const ApplicationPolicy = require("./application");

module.exports = class UserPolicy extends ApplicationPolicy{
  _isOwner() {
    return this.record && this.record == this.user.id;
  }

  _isAdmin() {
    return this.user && this.user.role == "admin";
  }

  show() {
    return this._isOwner() || this._isAdmin();
  }
}