const express = require("express");
const router = express.Router();
const catchAsync = require("../utilities/catchAsync");
const isLoggedIn = require("../middlewares/isLoggedIn");
const isAuthor = require("../middlewares/isAuthor");
const expControllers = require("../controllers/expControllers");
const validate = require("../middlewares/validate");
const multer = require("multer");
const { storage } = require("../cloudinary/index");
const upload = multer({ storage });

router
  .route("/")
  .get(catchAsync(expControllers.index))
  .post(
    isLoggedIn,
    validate,
    upload.array("images"),
    catchAsync(expControllers.addExp)
  );

router.get("/add", isLoggedIn, expControllers.renderAdd);

router.get("/myDiary", isLoggedIn, expControllers.myDiary);

router.get("/showMap", expControllers.showMap);

router
  .route("/:id")
  .get(catchAsync(expControllers.showExp))
  .put(
    isLoggedIn,
    isAuthor,
    validate,
    upload.array("images"),
    catchAsync(expControllers.editExp)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(expControllers.deleteExp));

router.get("/:id/edit", isLoggedIn, catchAsync(expControllers.renderEdit));

module.exports = router;
