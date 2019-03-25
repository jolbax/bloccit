const User = require("./models").User;
const Post = require("./models").Post;
const Comment = require("./models").Comment;
const Favorite = require("./models").Favorite;
const bcrypt = require("bcryptjs");

module.exports = {
  createUser(newUser, callback) {
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(newUser.password, salt);

    return User.create({
      email: newUser.email,
      password: hashedPassword
    })
      .then(user => {
        callback(null, user);
      })
      .catch(err => {
        callback(err);
      });
  },
  getUser(id, callback) {
    let result = {};
    User.findByPk(id)
    .then((user) => {
      if(!user) {
        callback(404);
      } else {
        result["user"] = user;
         Post.scope({method: ["lastFiveFor", id]}).findAll()
         .then((posts) => {
           result["posts"] = posts;
           Comment.scope({method: ["lastFiveFor", id]}).findAll()
           .then((comments) => {
             result["comments"] = comments;
             Favorite.scope({ method: ["allFavPostsFor", id]}).findAll()
             .then((favorites) => {
               result["favorites"] = favorites;
               callback(null, result);
             })
           })
           .catch((err) => {
             console.log(err);
             callback(err);
           });
         });
      }
    });
  }
};
