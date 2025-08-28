const Experience = require("../models/experience");
const Comment = require("../models/comment");

module.exports.addComment = async (req, res) => {
  const exp = await Experience.findById(req.params.id);
  const newComment = new Comment(req.body.comment);
  newComment.author = req.user._id;
  exp.comments.push(newComment);
  await newComment.save();
  await exp.save();
  res.redirect(`/experiences/${exp._id}`);
};

module.exports.deleteComment = async (req, res) => {
  const { id, commentId } = req.params;
  await Comment.findByIdAndDelete(commentId);
  await Experience.findByIdAndUpdate(id, { $pull: { comments: commentId } });
  res.redirect(`/experiences/${id}`);
};
