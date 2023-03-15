import { type Request, type NextFunction, type Response } from "express";
import CustomError from "../../CustomError/CustomError";
import { Quote } from "../../database/models/Quote";
import statusCodes from "../utils/statusCodes";
import { getQuotes } from "./quotesControllers";
import { type QuotesStructure } from "./types";

const {
  success: { okCode },
  clientError: { notFound },
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

const request: Partial<Request> = {};
const next: NextFunction = jest.fn().mockReturnThis();
const response: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

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
