import { Joi } from "express-validation";

const createQuoteSchema = {
  body: Joi.object({
    author: Joi.string().max(20).required(),
    image: Joi.string().required(),
    country: Joi.string().max(20).required(),
    quote: Joi.string().max(500).required(),
    tags: Joi.array().items(Joi.string().max(20)).required(),
    lived: Joi.string().max(20).required(),
    backgroundInfo: Joi.string().max(500).required(),
  }),
};

export default createQuoteSchema;
