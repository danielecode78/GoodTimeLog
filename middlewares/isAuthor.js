const Experience = require("../models/experience");

module.exports = async (req, res, next) => {
  if (req.user._id && req.params.id) {
    const exp = await Experience.findById(req.params.id);
    if (!exp.author.equals(req.user._id)) {
      req.flash("error", "Utente non autorizzato!");
      return res.redirect(`/experiences/${req.params.id}`);
    }
  }
  next();
};
