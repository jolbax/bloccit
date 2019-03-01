const express = require("express");
const router = express.Router();
const advertisementsController = require("../controllers/advertisementsController");

router.get("/advertisements", advertisementsController.index);
router.get("/advertisements/new", advertisementsController.new);
router.post("/advertisements/create", advertisementsController.create);
router.get("/advertisements/:id", advertisementsController.show);
router.post("/advertisements/:id/destroy", advertisementsController.destroy);
router.get("/advertisements/:id/edit", advertisementsController.edit);
router.post("/advertisements/:id/update", advertisementsController.update);

module.exports = router;