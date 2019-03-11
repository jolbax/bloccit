const Post = require("./models").Post;
const Topic = require("./models").Topic;
const Flair = require("./models").Flair;

module.exports = {
  addFlair(flair, callback) {
    return Flair.create(flair)
      .then(flair => {
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
  updateFlair(id, updatedFlair, callback) {
    return Flair.findByPk(id).then(flair => {
      flair
        .update(updatedFlair, {
          fields: Object.keys(updatedFlair)
        })
        .then(() => {
          callback(null, flair);
        })
        .catch(err => {
          callback(err);
        });
    });
  }
};
