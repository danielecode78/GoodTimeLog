const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Comment = require("./comment");

const ExperienceSchema = new Schema({
  title: String,
  images: [
    {
      url: String,
      filename: String,
    },
  ],
  date: String,
  location: String,
  coordinates: {
    type: Schema.Types.Mixed,
    default: {},
  },
  type: String,
  description: String,
  story: String,
  rate: Number,
  price: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  revisit: { type: Boolean, default: false },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

ExperienceSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Comment.deleteMany({
      _id: {
        $in: doc.comments,
      },
    });
  }
});

module.exports = mongoose.model("Experience", ExperienceSchema);
