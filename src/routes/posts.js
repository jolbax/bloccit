const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const validation = require("./validation");

router.get("/topics/:topicId/posts/new", postController.new );
router.post("/topics/:topicId/posts/create", validation.postChecks, validation.validateForm, postController.create );
router.get("/topics/:topicId/posts/:id", postController.show );
router.post("/topics/:topicId/posts/:id/destroy", postController.destroy );
router.get("/topics/:topicId/posts/:id/edit", postController.edit );
router.post("/topics/:topicId/posts/:id/update", validation.postChecks,validation.validateForm, postController.update );
router.post("/topics/:topicId/posts/:id/flair/:flairId/setFlair", postController.setFlair);

module.exports = router;