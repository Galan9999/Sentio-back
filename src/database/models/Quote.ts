import { model, Schema, SchemaTypes } from "mongoose";
import User from "./User.js";

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
    type: String,
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
  owner: {
    type: SchemaTypes.ObjectId,
    ref: User,
  },
});

export const Quote = model("Quote", quoteSchema, "quotes");
