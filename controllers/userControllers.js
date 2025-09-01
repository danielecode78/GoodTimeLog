const User = require("../models/user");

module.exports.renderRegister = (req, res) => {
  res.render("users/register");
};

module.exports.makeRegister = async (req, res, next) => {
  req.flash("error", "Versione TEST. Non è possibile registrarsi");
  return res.redirect("/register");
};

module.exports.renderLogin = (req, res) => {
  res.render("users/login");
};

module.exports.makeLogin = async (req, res) => {
  req.flash("success", `Bentornato/a! Felice di rivederti!`);
  const redirectUrl = res.locals.returnTo || "/experiences/myDiary";
  res.redirect(redirectUrl);
};

module.exports.makeLogout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Hai effettuato il logout. A presto!");
    res.redirect("/experiences");
  });
};
