const { experienceSchema } = require("../utilities/schemas");
const ExpressError = require("../utilities/ExpressError");

module.exports = (req, res, next) => {
  console.log(req.body);
  const { error } = experienceSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
