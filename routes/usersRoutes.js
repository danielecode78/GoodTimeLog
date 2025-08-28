const express = require("express");
const router = express.Router();
const catchAsync = require("../utilities/catchAsync");
const passport = require("passport");
const storeReturnTo = require("../middlewares/storeReturnTo");
const validateUser = require("../middlewares/validateUser");
const userControllers = require("../controllers/userControllers");

router
  .route("/register")
  .get(userControllers.renderRegister)
  .post(validateUser, catchAsync(userControllers.makeRegister));

router
  .route("/login")
  .get(userControllers.renderLogin)
  .post(
    storeReturnTo,
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    catchAsync(userControllers.makeLogin)
  );

router.get("/logout", userControllers.makeLogout);

module.exports = router;
