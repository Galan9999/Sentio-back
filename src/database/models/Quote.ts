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
  creationTime: {
    type: String,
    default: Date.now,
  },
  lived: {
    type: String,
    required: true,
  },
  owner: {
    type: SchemaTypes.ObjectId,
    ref: User,
  },
  backgroundInfo: {
    type: String,
    required: true,
  },
});

export const Quote = model("Quote", quoteSchema, "quotes");
