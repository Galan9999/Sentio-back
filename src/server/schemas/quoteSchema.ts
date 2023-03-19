import { Joi } from "express-validation";

const createQuoteSchema = {
  body: Joi.object({
    author: Joi.string().required(),
    image: Joi.required(),
    country: Joi.string().required(),
    quote: Joi.string().required(),
    tags: Joi.string().required(),
    lived: Joi.string().required(),
    owner: Joi.string().required(),
    backgroundInfo: Joi.string().required(),
  }),
};

export default createQuoteSchema;
