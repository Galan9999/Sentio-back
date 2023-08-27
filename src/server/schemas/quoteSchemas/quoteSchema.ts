import { Joi } from "express-validation";

const quoteSchema = {
  body: Joi.object({
    author: Joi.string().required(),
    country: Joi.string().required(),
    image: Joi.string(),
    tags: Joi.string().required(),
    creationTime: Joi.date().required(),
    lived: Joi.string().required(),
    quote: Joi.string().required(),
    owner: Joi.string().required(),
    backgroundInfo: Joi.string().required(),
  }),
};

export default quoteSchema;
