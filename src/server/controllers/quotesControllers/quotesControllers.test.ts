import { type Request, type NextFunction, type Response } from "express";
import mongoose from "mongoose";
import CustomError from "../../../CustomError/CustomError";
import { Quote } from "../../../database/models/Quote";
import statusCodes from "../../utils/statusCodes";
import {
  createQuote,
  deleteQuote,
  getQuoteById,
  getQuotes,
} from "./quotesControllers";
import {
  type CustomQuoteRequest,
  type DataBaseStructure,
  type QuotesStructure,
} from "../types";
import { mockCustomQuoteRequest } from "../../utils/mocks";

const {
  success: { okCode, created },
  clientError: { notFound, badRequest, conflict },
  serverError: { internalServer },
} = statusCodes;

const mockQuotesList: QuotesStructure = [
  {
    author: "René",
    image: "imagepath",
    country: "France",
    lived: "31/03/1596-11/02/1650",
    tags: "#politics",
    owner: "1234",
    imageBackup: "a",
    quote:
      "If you would be a real seeker after truth, it is necessary that at least once in your life you doubt, as far as possible, all things",
    creationTime: "edwefcew",
    backgroundInfo:
      "French philosopher, scientist, and mathematician, widely considered a seminal figure in the emergence of modern philosophy and science. Mathematics was central to his method of inquiry, and he connected the previously separate fields of geometry and algebra into analytic geometry.",
  },
];

const mockedDataBaseResponse: DataBaseStructure = {
  _id: {
    $oid: "6411df20c656524ed59cd21f",
  },
  author: "Barack Obama",
  image:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/President_Barack_Obama.jpg/440px-President_Barack_Obama.jpg",
  country: "United States",
  quote:
    "Change will not come if we wait for some other person or some other time. We are the ones we've been waiting for. We are the change that we seek.",
  tags: "politics",
  lived: "1961 - present",
  creationTime: "edwefcew",
  imageBackup: "a",
  owner: "12345",
  backgroundInfo:
    "Barack Obama is an American politician and attorney who served as the 44th president of the United States from 2009 to 2017.",
};

const mockedQuote = {
  id: "6411df20c656524ed59cd21f",
  author: "Barack Obama",
  image:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/President_Barack_Obama.jpg/440px-President_Barack_Obama.jpg",
  country: "United States",
  quote:
    "Change will not come if we wait for some other person or some other time. We are the ones we've been waiting for. We are the change that we seek.",
  tags: "politics",
  lived: "1961 - present",
  owner: "12345",
  backgroundInfo:
    "Barack Obama is an American politician and attorney who served as the 44th president of the United States from 2009 to 2017.",
};

const request: Partial<CustomQuoteRequest> = {};

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

      await getQuotes(
        request as CustomQuoteRequest,
        response as Response,
        next
      );

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

  describe("When it receives a request and the delete process fails", () => {
    test("Then it should call its next method with an error message of 'Invalid data!'", async () => {
      const expectedError = new CustomError(
        "Invalid object id!",
        badRequest,
        "Invalid data!"
      );

      request.params = { id: "" };

      await deleteQuote(
        request as Request<{ id: string }>,
        response as Response,
        next
      );

      Quote.findOneAndDelete = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValue(null),
      }));

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When it receives a request with an id that dont exists", () => {
    test("Then it should call its next method with an error message of 'Invalid data!'", async () => {
      const expectedError = new CustomError(
        "Mongoose method failed!",
        internalServer,
        "Couldn't delete!"
      );

      const databaseResponse = mockedDataBaseResponse;

      request.params = { id: "rgegergrwgwg" };

      Quote.findById = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValue(databaseResponse),
      }));

      await deleteQuote(
        request as Request<{ id: string }>,
        response as Response,
        next
      );

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When it receives an invalid id", () => {
    test("Then it should call next function with an error with message 'Invalid data'", async () => {
      const expectedErrorMessage = "Invalid data!";

      mongoose.Types.ObjectId.isValid = () => false;

      await deleteQuote(
        request as Request<{ id: string }>,
        response as Response,
        next
      );

      expect.objectContaining({ publicMessage: expectedErrorMessage });
    });
  });

  describe("When it receives a request and the deleting process fails", () => {
    test("Then it should call the received next function with message 'Couldn't delete!'", async () => {
      const expectedErrorMessage = "Couldn't delete!";

      mongoose.Types.ObjectId.isValid = () => true;

      Quote.findByIdAndDelete = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValue(null),
      }));

      await deleteQuote(
        request as Request<{ id: string }>,
        response as Response,
        next
      );

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ publicMessage: expectedErrorMessage })
      );
    });
  });
});

describe("Given the createQuote controller", () => {
  describe("When it recieves a request with 'Frida Kahlo'", () => {
    test("Then it should respond with a message `Frida Kahlo created`", async () => {
      const expectedStatus = created;
      const expectedBody = { message: "Frida Kahlo created!" };

      const request: Partial<CustomQuoteRequest> = mockCustomQuoteRequest;

      Quote.create = jest.fn().mockResolvedValue(request.body);

      await createQuote(
        request as CustomQuoteRequest,
        response as Response,
        next
      );

      expect(response.status).toHaveBeenCalledWith(expectedStatus);
      expect(response.json).toHaveBeenCalledWith(expectedBody);
    });
  });

  describe("When it recieves a request with 'Frida Kahlo'", () => {
    test("Then it should respond with a message `Couldn't create!`", async () => {
      const expectedError = new CustomError(
        "Couldn't create quote!",
        conflict,
        "Couldn't create quote!"
      );

      const request: Partial<CustomQuoteRequest> = mockCustomQuoteRequest;

      Quote.create = jest.fn().mockReturnValue(false);

      await createQuote(
        request as CustomQuoteRequest,
        response as Response,
        next
      );

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});

describe("Given getQuote controller", () => {
  const req: Partial<Request> = {
    params: { id: mockedQuote.id },
  };
  describe("When it recieves a request with the id: `6411df20c656524ed59cd21f`", () => {
    test("Then it should respond with status 200 and respond with a quote with id `6411df20c656524ed59cd21f`", async () => {
      Quote.findOne = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValue(mockedQuote),
      }));

      await getQuoteById(req as Request, response as Response, next);

      expect(response.status).toHaveBeenCalledWith(okCode);
    });
  });
  describe("When the finding quote process fails", () => {
    test("Then it should call its next method with an error message: 'Quote not found!' and status 404", async () => {
      const expectedError = new CustomError(
        "Couldn't get!",
        notFound,
        "Couldn't get!"
      );

      Quote.findById = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValue(false),
      }));

      await getQuoteById(req as Request, response as Response, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When it receives an invalid id", () => {
    test("Then it should call next function with an error with message 'Invalid Id'", async () => {
      const req: Partial<Request> = {
        params: { id: "" },
      };
      const expectedError = new CustomError(
        "Invalid object id!",
        badRequest,
        "Invalid data!"
      );
      mongoose.Types.ObjectId.isValid = () => false;
      Quote.findById = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValue(mockedDataBaseResponse),
      }));

      await getQuoteById(req as Request, response as Response, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});
