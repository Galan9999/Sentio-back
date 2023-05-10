import { type Urls } from "./types";

const urls: Urls = {
  getQuote: "/",
  getByIdQuote: "/:quoteId",
  createQuote: "/create",
  registerUrl: "/register",
  loginUrl: "/login",
  usersUrl: "/users",
};

export default urls;
