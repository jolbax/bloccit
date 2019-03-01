const Advertisement = require("./models").Advertisement;
module.exports = {
  getAllAdvertisements(callback) {
    return Advertisement.findAll()
      .then(advertisements => {
        callback(null, advertisements);
      })
      .catch(err => {
        callback(err);
      });
  },
  createAdvertisement(advertisement, callback) {
    return Advertisement.create(advertisement)
      .then(advertisement => {
        callback(null, advertisement);
      })
      .catch(err => {
        callback(err);
      });
  },
  getAdvertisement(id, callback) {
    return Advertisement.findByPk(id)
      .then(advertisement => {
        callback(null, advertisement);
      })
      .catch(err => {
        callback(err);
      });
  },
  deleteAdvertisement(id, callback) {
    return Advertisement.destroy({ where: { id } })
      .then(advertisement => {
        callback(null, advertisement);
      })
      .catch(err => {
        callback(err);
      });
  },
  updateAdvertisement(id, updatedAdvertisement, callback) {
    return Advertisement.findByPk(id).then(advertisement => {
      if(!advertisement){
        return callback("Advertisement not found")
      }

      advertisement.update(updatedAdvertisement,
        {
          fields: Object.keys(updatedAdvertisement)
        })
        .then(advertisement => {
          callback(null, advertisement);
        })
        .catch(err => {
          callback(err);
        });
    })
  }
}