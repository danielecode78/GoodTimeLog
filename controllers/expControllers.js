const Experience = require("../models/experience");
const dateit = require("../public/scripts/dateit");
const { types } = require("../seeds/seedHelpers");
const { cloudinary } = require("../cloudinary/index");

module.exports.index = async (req, res) => {
  let nr = 4;
  let page = 1;
  const category = req.query.category || "";
  const search = req.query.search || "";
  if (req.query.page === "*") {
    nr = 0;
  } else {
    page = parseInt(req.query.page) || 1;
  }

  const query = {};

  if (req.user && req.user._id) {
    query.author = { $ne: req.user._id };
  }

  if (category) {
    query.type = category;
  }

  if (search) {
    const escapeRegex = (text) =>
      text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    const safeSearch = escapeRegex(search);
    const regex = new RegExp(safeSearch, "i");

    query.$or = [
      { description: { $regex: regex } },
      { title: { $regex: regex } },
      { location: { $regex: regex } },
    ];
  }

  const total = await Experience.countDocuments(query);
  const exps = await Experience.find(query)
    .sort({ date: -1 })
    .skip((page - 1) * nr)
    .limit(nr);

  res.render("experiences/index", {
    exps,
    currentPage: page,
    totPages: nr === 0 ? 1 : Math.ceil(total / nr),
    dateit,
    category,
  });
};

module.exports.myDiary = async (req, res) => {
  let nr = 4;
  let page = 1;
  const category = req.query.category || "";
  const search = req.query.search || "";

  if (req.query.page === "*") {
    nr = 0;
  } else {
    page = parseInt(req.query.page) || 1;
  }

  const query = {
    author: req.user._id,
  };
  if (category) {
    query.type = category;
  }

  if (search) {
    const escapeRegex = (text) =>
      text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    const safeSearch = escapeRegex(search);
    const regex = new RegExp(safeSearch, "i");

    query.$or = [
      { description: { $regex: regex } },
      { title: { $regex: regex } },
      { location: { $regex: regex } },
    ];
  }

  const total = await Experience.countDocuments(query);
  const exps = await Experience.find(query)
    .sort({ date: -1 })
    .skip((page - 1) * nr)
    .limit(nr);

  res.render("experiences/myDiary", {
    exps,
    currentPage: page,
    totPages: nr === 0 ? 1 : Math.ceil(total / nr),
    dateit,
    category,
  });
};

module.exports.showMap = async (req, res) => {
  const category = req.query.category || "";
  let query = {};
  if (req.user && req.user._id && req.query.diary === "true") {
    query = {
      author: req.user._id,
    };
  } else if (req.user && req.user._id && req.query.diary === "false") {
    query = {
      author: { $ne: req.user._id },
    };
  }
  if (category) {
    query.type = category;
  }
  const exps = await Experience.find(query);
  res.json(exps);
};

module.exports.renderAdd = (req, res) => {
  res.render("experiences/add", { types });
};

module.exports.showExp = async (req, res) => {
  const exp = await Experience.findById(req.params.id)
    .populate({ path: "comments", populate: { path: "author" } })
    .populate("author");
  if (!exp) {
    req.flash("error", "Esperienza non trovata!!!");
    return res.redirect("/experiences");
  }
  res.render("experiences/show", { exp, dateit });
};

module.exports.renderEdit = async (req, res) => {
  const exp = await Experience.findById(req.params.id);
  if (!exp.author.equals(req.user._id)) {
    req.flash("error", "Utente non autorizzato!");
    return res.redirect(`/experiences/${req.params.id}`);
  }
  res.render("experiences/edit", { exp, types });
};

module.exports.addExp = async (req, res, next) => {
  console.log(req.body.experiences.coordinates);
  const parsedCoordinates = JSON.parse(req.body.experiences.coordinates);
  const myexp = new Experience({
    ...req.body.experiences,
    coordinates: parsedCoordinates,
    revisit: req.body.experiences.revisit === "true",
  });
  myexp.images = req.files.map((el) => ({
    url: el.path,
    filename: el.filename,
  }));
  myexp.author = req.user._id;
  await myexp.save();
  req.flash("success", "Nuova esperienza aggiunta con successo!");
  res.redirect(`/experiences/${myexp._id}`);
};

module.exports.editExp = async (req, res) => {
  const parsedCoordinates = JSON.parse(req.body.experiences.coordinates);
  const myexp = await Experience.findByIdAndUpdate(req.params.id, {
    ...req.body.experiences,
    coordinates: parsedCoordinates,
    revisit: req.body.experiences.revisit === "true",
  });
  const imgsArr = req.files.map((el) => ({
    url: el.path,
    filename: el.filename,
  }));
  myexp.images.push(...imgsArr);
  myexp.author = req.user._id;
  await myexp.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await Experience.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  req.flash("success", "Esperienza modificata con successo!");
  res.redirect(`/experiences/${req.params.id}`);
};

module.exports.deleteExp = async (req, res) => {
  await Experience.findByIdAndDelete(req.params.id);
  req.flash("success", "Esperienza eliminata con successo!");
  res.redirect("/experiences");
};
