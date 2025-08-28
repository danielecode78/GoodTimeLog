const Joi = require("joi");

module.exports.experienceSchema = Joi.object({
  experiences: Joi.object({
    title: Joi.string().required(),
    date: Joi.date().required(),
    type: Joi.string().required(),
    location: Joi.string().required(),
    coordinates: Joi.object().required(),
    description: Joi.string().required(),
    story: Joi.string().empty(""),
    images: Joi.array()
      .items(
        Joi.object({
          url: Joi.string().uri().required(),
          filename: Joi.string().required(),
        })
      )
      .default([]),
    price: Joi.number().min(0).empty(""),
    rate: Joi.number().min(0).max(5),
    revisit: Joi.boolean(),
  }).required(),
});

module.exports.commentSchema = Joi.object({
  comment: Joi.object({
    text: Joi.string().required(),
  }).required(),
});

module.exports.userSchema = Joi.object({
  user: Joi.object({
    username: Joi.string().required(),
    password: Joi.string()
      .min(8)
      .max(64)
      .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[\\W_]).+$"))
      .required()
      .messages({
        "string.pattern.base":
          "La password deve contenere almeno una lettera maiuscola, una minuscola, un numero e un carattere speciale.",
        "string.min": "La password deve contenere almeno 8 caratteri.",
        "string.max": "La password non può superare i 64 caratteri.",
      }),
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
  }),
});
