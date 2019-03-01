const advertisementsQueries = require("../db/queries.advertisements.js");
module.exports = {
  index(req, res, next) {
    advertisementsQueries.getAllAdvertisements((err, advertisements) => {
      if (err) {
        res.redirect(500, "static/index");
      } else {
        res.render("advertisements/index", { advertisements });
      }
    });
  },
  new(req, res, next) {
    res.render("advertisements/new");
  },
  create(req, res, next) {
    let newAdvertisement = {
      title: req.body.title,
      description: req.body.description
    };
    advertisementsQueries.createAdvertisement(
      newAdvertisement,
      (err, advertisement) => {
        if (err) {
          res.redirect(500, "/advertisement/new");
        } else {
          res.redirect(303, `/advertisements/${advertisement.id}`);
        }
      }
    );
  },
  show(req, res, next) {
    advertisementsQueries.getAdvertisement(
      req.params.id,
      (err, advertisement) => {
        if (err) {
          res.redirect(500, "/advertisements");
        } else {
          res.render("advertisements/show", { advertisement });
        }
      }
    );
  },
  destroy(req, res, next) {
    advertisementsQueries.deleteAdvertisement(
      req.params.id,
      (err, advertisement) => {
        if (err) {
          res.redirect(500, `/advertisements/${req.params.id}`);
        } else {
          res.redirect(303, "/advertisements");
        }
      }
    );
  },
  edit(req, res, next) {
    advertisementsQueries.getAdvertisement(req.params.id, (err, advertisement) => {
      if(err) {
        res.redirect(500, `/advertisements/${req.params.id}`);
      }else{
        res.render("advertisements/edit", {advertisement});
      }
    })
  },
  update(req, res, next) {
    advertisementsQueries.updateAdvertisement(req.params.id, req.body, (err, advertisement) => {
      if(err || advertisement == null ) {
        res.redirect(404, `/advertisements/${req.params.id}/edit`);
      } else {
        res.redirect(303, `/advertisements/${advertisement.id}`);
      }
    });
  }
};
