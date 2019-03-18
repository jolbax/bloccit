const Post = require("./models").Post;
const Topic = require("./models").Topic;
const Flair = require("./models").Flair;
const Authorizer = require("../policies/flair");

module.exports = {
  addFlair(flair, callback) {
    return Flair.findOrCreate({
      where: flair
    })
      .then(([flair, createdFlair]) => {
        callback(null, flair);
      })
      .catch(err => {
        callback(err);
      });
  },
  getFlair(id, callback) {
    return Flair.findByPk(id)
      .then(flair => {
        callback(null, flair);
      })
      .catch(err => {
        callback(err);
      });
  },
  validateNewAndEdit(req, callback) {
    Post.findByPk(req.params.postId)
    .then((post) => {
      if(!post) {
        return callback("Post not found");
      }

      const authorized = new Authorizer(req.user, post).new();

      if(authorized) {
        callback(null, post)
      } else {
        callback("Forbidden");
      }
    })
  },
  deleteFlair(id, callback) {
    return Flair.destroy({where:{ id}})
    .then((flair) => {
      callback(null, flair);
    })
    .catch((err) => {
      callback(err);
    })
  },
  updateFlair(id, updatedFlair, callback) {
    Flair.findOne({where: updatedFlair})
    .then((flair) => {
      if(!flair) {
        return Flair.create(updatedFlair)
        .then((newFlair) => {
          callback(null, newFlair);
        })
        .catch((err) => {
          callback(err);
        })
      }
      return callback(null, flair);
    })
    .catch((err) => {
      return callback(err);
    })
  },
  cleanUpFlair(id, callback){
    return Flair.findByPk(id).then(flair => {
      flair
        .getPosts()
        .then((posts) => {
          if(posts.length === 0){
            Flair.destroy({where: { id }})
            .then((destroyedFlair) => {
              callback(null, destroyedFlair)
            })
            .catch((err) => {
              callback(err);
            })
          }
        })
    });
  }
};
