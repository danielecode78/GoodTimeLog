const { userSchema } = require("../utilities/schemas");
const ExpressError = require("../utilities/ExpressError");

module.exports = (req, res, next) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(msg, 400);
  }
  next();
};
