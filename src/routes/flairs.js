const express = require("express");
const router = express.Router();
const flairController = require("../controllers/flairController");

router.get("/topics/:topicId/posts/:postId/flair/new", flairController.new);
router.post("/topics/:topicId/posts/:postId/flair/create", flairController.create);
router.get("/topics/:topicId/posts/:postId/flair/:flairId/edit", flairController.edit);
router.post("/topics/:topicId/posts/:postId/flair/:flairId/update", flairController.update);

module.exports = router;