const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GitHubStrategy = require("passport-github").Strategy;
const User = require("../db/models").User;
const authHelper = require("../auth/helpers");

module.exports = {
  init(app) {
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(
      new GitHubStrategy(
        {
          clientID: "4a9ada78281f1eb4beb6",
          clientSecret: "7353937593a3e5509c6a4a7cae228e7859cc38c0",
          callbackURL: 'http://localhost:3000/auth/github/callback'
        },
        (accessToken, refreshToken, profile, done) => {
            return done(null, profile);
        }
      )
    );

    passport.serializeUser((user, callback) => {
      callback(null, user);
    });

    passport.deserializeUser((obj, callback) => {
      callback(null, obj);
    });
  }
};
