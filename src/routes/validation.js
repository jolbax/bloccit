const {check, validationResult} = require("express-validator/check");

postChecks = [
  check('topicId', 'must be valid').not().isEmpty().isInt(),
  check('title', 'must be at least 2 characters in length').isLength({ min: 2 }),
  check('body', 'must be at least 10 characters in length').isLength({ min: 10 }),
];

topicChecks = [
  check('title', 'must be at least 5 characters in length').isLength({ min: 5 }),
  check('description', 'must be at least 10 characters in length').isLength({ min: 10 })
];

module.exports = {
  validateForm(req, res, next) {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
      req.flash("error", errors.array());

      return res.redirect(303, req.headers.referer);
    } else {
      return next();
    }
  },
  postChecks,
  topicChecks
}