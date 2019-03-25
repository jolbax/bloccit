const userQueries = require("../db/queries.user.js");
const passport = require("passport");
const Authorizer = require("../policies/user");

module.exports = {
  signUp(req, res, next) {
    res.render("users/sign_up");
  },
  create(req, res, next) {
    let newUser = {
      email: req.body.email,
      password: req.body.password,
      passwordConfirmation: req.body.passwordConfirmation
    };
    userQueries.createUser(newUser, (err, user) => {
      if (err) {
        req.flash("error", err);
        res.redirect("/users/sign_up");
      } else {
        passport.authenticate("local")(req, res, () => {
          req.flash("notice", "You've successfully signed in!");
          res.redirect("/");
        });
      }
    });
  },
  singInForm(req, res, next) {
    res.render("users/sign_in");
  },
  signIn(req, res, next) {
    passport.authenticate("local")(req, res, () => {
      if (!req.user) {
        req.flash("notice", "Sign in failed. Please try again.");
        res.redirect("/users/sign_in");
      } else {
        req.flash("notice", "You've successfully signed in!");
        res.redirect("/");
      }
    });
  },
  signOut(req, res, next) {
    req.logout();
    req.flash("notice", "You've successfully signed out!");
    res.redirect("/");
  },
  show(req, res, next) {
    let authorized = new Authorizer(req.user, req.params.id).show();

    userQueries.getUser(req.params.id, (err, result) => {
      if(err || result.user === undefined) {
        req.flash("notice", "No user found with that ID");
        res.redirect("/");
      } else {
        if(authorized){
          res.render("users/show", {...result});
        } else {
          req.flash("notice", "You are not allowed to access this page");
          res.redirect("/");
        }
      }
    })
  }
};
