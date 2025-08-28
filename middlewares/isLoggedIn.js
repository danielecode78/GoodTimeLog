module.exports = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "Spiacente. Devi essere loggato/a");
    return res.redirect("/login");
  }
  next();
};
