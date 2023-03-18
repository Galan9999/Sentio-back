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
  sub: string;
  username: string;
}

export type CustomRequest = Request<
  Record<string, unknown>,
  Record<string, unknown>,
  UserCredentials
>;
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
export interface DataBaseResponse extends QuoteStructure {
  _id: {
    $oid: string;
  };
}
