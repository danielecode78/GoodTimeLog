const Comment = require("../models/comment");

module.exports = async (req, res, next) => {
  if (req.user._id && req.params.commentId) {
    targetComment = await Comment.findById(req.params.commentId);
    console.log(targetComment);
    if (!targetComment.author.equals(req.user._id)) {
      req.flash("error", "Utente non autorizzato!");
      return res.redirect(`/experiences/${req.params.id}`);
    }
  }
  next();
};
