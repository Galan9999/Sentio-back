import { model, Schema } from "mongoose";

const quoteSchema = new Schema({
  author: {
    type: String,
    required: true,
  },
  lived: {
    type: String,
    required: true,
  },
  tags: {
    type: Array,
    required: true,
  },
  quote: {
    type: String,
    required: true,
  },
  backgroundInfo: {
    type: String,
    required: true,
  },
});

const User = model("Quote", quoteSchema, "quotes");
