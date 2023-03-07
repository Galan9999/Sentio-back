import { type NextFunction, type Request, type Response } from "express";
import CustomError from "../../CustomError/CustomError";
import { generalError, notFoundError } from "./errorMiddlewares";
import statusCodes from "../utils/statusCodes";
const {
  clientError: { notFound, badRequest },
  serverError: { internalServer },
} = statusCodes;

beforeEach(() => jest.clearAllMocks());

const req = {} as Request;

const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
} as Partial<Response>;

const next = jest.fn() as NextFunction;

describe("Given the 'notFoundError' middleware", () => {
  describe("When it receives a request", () => {
    test("Then it should call its next method with a status code 404, and a message and public message 'Endpoint not found'", () => {
      const expectedError = new CustomError(
        "Path not found",
        notFound,
        "Endpoint not found"
      );

      notFoundError(req, res as Response, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});

describe("Given the 'generalError' middleware", () => {
  describe("When it receives an error with statusCode 400 and a public message 'Something went wrong'  ", () => {
    test("Then it should call its response status method with a 400 and json method with the public message received", () => {
      const error = new CustomError(
        "Bad request",
        badRequest,
        "Something went wrong"
      );
      generalError(error, req, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(badRequest);
      expect(res.json).toHaveBeenCalledWith({ error: error.publicMessage });
    });
  });

  describe("When the error received is not a custom error", () => {
    test("Then it should call its response status method with 500 and public message 'Something went wrong'", () => {
      const error = new Error();
      const expectedPublicMessage = "Something went wrong";

      generalError(error as CustomError, req, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(internalServer);
      expect(res.json).toHaveBeenCalledWith({ error: expectedPublicMessage });
    });
  });
});
