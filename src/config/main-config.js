require("dotenv").config();
const path = require("path");
const viewsFolder = path.join(__dirname, "..", "views");
const bodyParse = require("body-parser");
const session = require("express-session")
const flash = require("express-flash")

module.exports = {
  init(app, express) {
    app.set("views", viewsFolder);
    app.set("view engine", "ejs");
    app.use(bodyParse.urlencoded({extended: true}));
    app.use(session({
      secret: process.env.cookieSecret,
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 60000}
    }));
    app.use(flash());
    app.use(express.static(path.join(__dirname, "..", "assets")));
  }
};