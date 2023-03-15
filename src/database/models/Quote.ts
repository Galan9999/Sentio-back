import { model, Schema } from "mongoose";

const quoteSchema = new Schema({
  author: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    requiered: true,
  },
  country: {
    type: String,
    requiered: true,
  },
  quote: {
    type: String,
    required: true,
  },
  tags: {
    type: Array,
    required: true,
  },
  lived: {
    type: String,
    required: true,
  },
  backgroundInfo: {
    type: String,
    required: true,
  },
});

export const Quote = model("Quote", quoteSchema, "quotes");
