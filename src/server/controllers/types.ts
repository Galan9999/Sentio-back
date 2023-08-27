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

export type CustomRegisterRequestCredentials = Request<
  Record<string, unknown>,
  Record<string, unknown>,
  RegisterCredentials
>;
export interface QuoteStructure {
  author: string;
  image: string;
  country: string;
  quote: string;
  tags: string;
  lived: string;
  backgroundInfo: string;
  creationTime: Date | string;
  owner: string;
  imageBackup: string;
}

export type QuotesStructure = QuoteStructure[];
export interface DataBaseStructure extends QuoteStructure {
  _id: {
    $oid: string;
  };
}
export interface CustomQuoteRequest
  extends Request<
    Partial<Params>,
    Record<string, unknown>,
    Partial<QuoteStructure>
  > {
  userId?: string;
  imageBackup?: string;
}

export interface Params {
  id: string;
}
