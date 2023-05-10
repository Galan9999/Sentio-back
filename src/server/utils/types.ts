export interface StatusCodes {
  clientError: {
    notFound: number;
    badRequest: number;
    unauthorized: number;
    conflict: number;
  };
  serverError: {
    internalServer: number;
  };
  success: { okCode: number; created: number };
}
export interface Urls {
  registerUrl: string;
  loginUrl: string;
  getQuote: string;
  getByIdQuote: string;
  createQuote: string;
  usersUrl: string;
}
