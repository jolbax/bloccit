const flairQueries = require("../db/queries.flairs.js");
const Authorizer = require("../policies/flair");

module.exports = {
  new(req, res, next) {
    flairQueries.validateNewAndEdit(req, (err, post) => {
      if (err) {
        req.flash("notice", "You are not authorized to do that");
        res.redirect(
          `/topics/${req.params.topicId}/posts/${req.params.postId}`
        );
      } else {
        res.render("flairs/new", {
          topicId: req.params.topicId,
          postId: req.params.postId
        });
      }
    });
  },
  create(req, res, next) {
    let newFlair = {
      name: req.body.name,
      color: req.body.color,
      topicId: req.params.topicId
    };
    flairQueries.addFlair(newFlair, (err, flair) => {
      if (err) {
        res.redirect(
          500,
          `/topics/${req.params.topicId}/posts/${req.params.postId}/flair/new`
        );
      } else {
        res.redirect(
          307,
          `/topics/${req.params.topicId}/posts/${req.params.postId}/flair/${
            flair.id
          }/setFlair`
        );
      }
    });
  },
  edit(req, res, next) {
    flairQueries.validateNewAndEdit(req, (err, post) => {
      if (err) {
        req.flash("notice", "You are not allowed to do that");
        res.redirect(
          `/topics/${req.params.topicId}/posts/${req.params.postId}`
        );
      } else {
        flairQueries.getFlair(req.params.flairId, (err, flair) => {
          if (err || !flair) {
            res.redirect(
              400,
              `/topics/${req.params.topicId}/posts/${req.params.postId}`
            );
          } else {
            res.render("flairs/edit", {
              flair,
              topicId: req.params.topicId,
              postId: req.params.postId
            });
          }
        });
      }
    });
  },
  update(req, res, next) {
    let updatedFlair = {
      name: req.body.name,
      color: req.body.color,
      topicId: req.params.topicId
    };
    flairQueries.updateFlair(req.params.flairId, updatedFlair, (err, flair) => {
      if (err || !flair) {
        res.redirect(
          500,
          `/topics/${req.params.topicId}/posts/${req.params.postId}/flair/${
            req.params.flairId
          }/edit`
        );
      } else {
        res.redirect(
          307,
          `/topics/${req.params.topicId}/posts/${req.params.postId}/flair/${
            flair.id
          }/setFlair`
        );
      }
    });
  }
};
