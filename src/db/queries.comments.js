const Comment = require("./models").Comment;
const Post = require("./models").Post;
const User = require("./models").User;

const Authorizer = require("../policies/comment");

module.exports = {
  createComment(newComment, callback) {
    return Comment.create(newComment)
      .then(comment => {
        callback(null, comment);
      })
      .catch(err => {
        callback(err);
      });
  },
  deleteComment(req, callback) {
    return Comment.findByPk(req.params.id).then((comment) => {

      const authorized = new Authorizer(req.user, comment).destroy();

      if (authorized) {
        comment.destroy();
        callback(null, comment);
      } else {
        req.flash("comment", "You are not allowed to do that");
        callback(401);
      }
    });
  }
};
