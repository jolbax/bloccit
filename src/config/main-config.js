require("dotenv").config();
const path = require("path");
const viewsFolder = path.join(__dirname, "..", "views");
const bodyParse = require("body-parser");

module.exports = {
  init(app, express) {
    app.set("views", viewsFolder);
    app.set("view engine", "ejs");
    app.use(bodyParse.urlencoded({extended: true}));
    app.use(express.static(path.join(__dirname, "..", "assets")));
  }
};