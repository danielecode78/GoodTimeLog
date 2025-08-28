const express = require("express");
const router = express.Router();
const catchAsync = require("../utilities/catchAsync");
const isLoggedIn = require("../middlewares/isLoggedIn");
const isCommentAuthor = require("../middlewares/isCommentAuthor");
const validateComment = require("../middlewares/validateComment");
const comControllers = require("../controllers/comControllers");

router.post(
  "/experiences/:id/comments",
  isLoggedIn,
  validateComment,
  catchAsync(comControllers.addComment)
);

router.delete(
  "/experiences/:id/comments/:commentId",
  isLoggedIn,
  isCommentAuthor,
  catchAsync(comControllers.deleteComment)
);

module.exports = router;
