import { type Urls } from "./types";

const urls: Urls = {
  getQuotesUrl: "/",
  getByIdQuoteUrl: "/:id",
  deleteQuoteUrl: "/:id",
  createQuoteUrl: "/create",
  registerUrl: "/register",
  loginUrl: "/login",
  usersUrl: "/users",
};

export default urls;
