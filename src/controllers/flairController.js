const flairQueries = require("../db/queries.flairs.js");

module.exports = {
  new(req, res, next) {
    res.render("flairs/new", {
      topicId: req.params.topicId,
      postId: req.params.postId
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
  },
  update(req, res, next) {
    flairQueries.updateFlair(req.params.flairId, req.body, (err, flair) => {
      if (err || !flair) {
        res.redirect(
          500,
          `/topics/${req.params.topicId}/posts/${req.params.postId}/flair/${
            req.params.flairId
          }/edit`
        );
      } else {
        res.redirect(
          `/topics/${req.params.topicId}/posts/${req.params.postId}`
        );
      }
    });
  }
};
