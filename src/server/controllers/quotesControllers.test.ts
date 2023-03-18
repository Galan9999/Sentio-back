import { type Request, type NextFunction, type Response } from "express";
import CustomError from "../../CustomError/CustomError";
import { Quote } from "../../database/models/Quote";
import statusCodes from "../utils/statusCodes";
import { deleteQuote, getQuotes } from "./quotesControllers";
import { type DataBaseResponse, type QuotesStructure } from "./types";

const {
  success: { okCode },
  clientError: { notFound, badRequest },
} = statusCodes;

const mockQuotesList: QuotesStructure = [
  {
    author: "René",
    image: "imagepath",
    country: "France",
    lived: "31/03/1596-11/02/1650",
    tags: ["#politics", "#philosphy"],
    quote:
      "If you would be a real seeker after truth, it is necessary that at least once in your life you doubt, as far as possible, all things",
    backgroundInfo:
      "French philosopher, scientist, and mathematician, widely considered a seminal figure in the emergence of modern philosophy and science. Mathematics was central to his method of inquiry, and he connected the previously separate fields of geometry and algebra into analytic geometry.",
  },
];

const mockedDataBaseResponse: DataBaseResponse = {
  _id: {
    $oid: "6411df20c656524ed59cd21f",
  },
  author: "Barack Obama",
  image:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/President_Barack_Obama.jpg/440px-President_Barack_Obama.jpg",
  country: "United States",
  quote:
    "Change will not come if we wait for some other person or some other time. We are the ones we've been waiting for. We are the change that we seek.",
  tags: ["politics"],
  lived: "1961 - present",
  backgroundInfo:
    "Barack Obama is an American politician and attorney who served as the 44th president of the United States from 2009 to 2017.",
};

const request: Partial<Request> = {};

const response: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const next: NextFunction = jest.fn().mockReturnThis();

beforeEach(() => jest.clearAllMocks());

describe("Given the getQuotes controller", () => {
  describe("When it receives a response with the quotes", () => {
    test("Then is should call its status method with 200 and a list of quotes", async () => {
      Quote.find = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValue(mockQuotesList),
      }));

      await getQuotes(request as Request, response as Response, next);

      expect(response.status).toHaveBeenCalledWith(okCode);
      expect(response.json).toHaveBeenCalledWith({ quotes: mockQuotesList });
    });
  });

  describe("When it receives a response without quotes", () => {
    test("Then is should call next function with 'Quote not found!' message", async () => {
      const customError = new CustomError(
        "Quote not found!",
        notFound,
        "Couldn't retrieve quote!"
      );

      Quote.find = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValue(false),
      }));

      await getQuotes(request as Request, response as Response, next);

      expect(next).toHaveBeenCalledWith(customError);
    });
  });
});

describe("Given the deleteQuote controller", () => {
  describe("When invoked with a valid id '6411df20c656524ed59cd21f'", () => {
    test("Then it should call its status method with 200 and json method with a deleted author in its body", async () => {
      const expectedStatusCode = okCode;
      const expetedBodyResponse = { message: "Barack Obama deleted!" };

      const databaseResponse = mockedDataBaseResponse;

      request.params = { id: "6411df20c656524ed59cd21f" };

      Quote.findOneAndDelete = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValue(databaseResponse),
      }));

      await deleteQuote(
        request as Request<{ id: string }>,
        response as Response,
        next
      );

      expect(response.status).toHaveBeenCalledWith(expectedStatusCode);
      expect(response.json).toHaveBeenCalledWith(expetedBodyResponse);
    });
  });

  describe("When it receives a request with an invalid id format like an empty id", () => {
    test("Then it should call its next method with an error message of 'invalid data!'", async () => {
      const expectedError = new CustomError(
        "Invalid object id!",
        badRequest,
        "Invalid data!"
      );

      const databaseResponse = mockedDataBaseResponse;

      request.params = { id: "" };

      await deleteQuote(
        request as Request<{ id: string }>,
        response as Response,
        next
      );

      Quote.findOneAndDelete = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValue(databaseResponse),
      }));

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When it receives a request with an id that dont exists", () => {
    test("Then it should call its next method with an error message of 'Couldn't delete!'", async () => {
      const expectedError = new CustomError(
        "Mongoose method failed!",
        notFound,
        "Couldn't delete!"
      );

      request.params = { id: "rgegergrwgwg" };

      Quote.findOneAndDelete = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValue(false),
      }));

      await deleteQuote(
        request as Request<{ id: string }>,
        response as Response,
        next
      );

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});
