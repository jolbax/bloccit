const ApplicationPolicy = require("./application");

module.exports = class PostPolicy extends ApplicationPolicy {
  new() {
    return this.user != null || this._isAdmin();
  }

  create() {
    return this.new();
  }

  update() {
    return super.edit();
  }

  setFlair(){
    return super.edit();
  }

  destroy() {
    return this.update();
  }
};
