import { type Request } from "express";
import { type JwtPayload } from "jsonwebtoken";

export interface UserCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials extends UserCredentials {
  email: string;
}

export interface CustomJwtPayload extends JwtPayload {
  id: string;
  username: string;
}

export type CustomRequestCredentials = Request<
  Record<string, unknown>,
  Record<string, unknown>,
  UserCredentials
>;

export interface CustomRequest extends Request {
  owner: string;
  id: string;
}
export interface QuoteStructure {
  author: string;
  image: string;
  country: string;
  quote: string;
  tags: string[];
  lived: string;
  backgroundInfo: string;
}

export type QuotesStructure = QuoteStructure[];
export interface DataBaseStructure extends QuoteStructure {
  _id: {
    $oid: string;
  };
}

export interface QuoteModelStructure extends QuoteStructure {
  id: string;
}

export interface CustomQuoteRequest
  extends Request<
    Record<string, unknown>,
    Record<string, unknown>,
    QuoteStructure,
    { token: string }
  > {
  userId: string;
  imageBackUp: string;
}
