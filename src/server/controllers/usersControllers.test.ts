import { type Response, type NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { type CustomRequestCredentials, type UserCredentials } from "./types";
import loginUser from "./usersControllers";
import statusCodes from "../utils/statusCodes";
import User from "../../database/models/User";
import CustomError from "../../CustomError/CustomError";

const {
  success: { okCode },
  clientError: { unauthorized },
  serverError: { internalServer },
} = statusCodes;

const carles: UserCredentials = {
  username: "Carles",
  password: "galan99",
};

const request: Partial<CustomRequestCredentials> = {
  body: carles,
};

const response: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const next: NextFunction = jest.fn();

beforeEach(() => jest.clearAllMocks);

describe("Given the loginUser controller", () => {
  describe("When it receives a request with correct username 'Carles' and password 'galan99'", () => {
    test("Then it should call its response status method with a code 200 and return a token in its body", async () => {
      const expectedStatus = okCode;
      const expectedBody = {
        token: "$2a$12$8S4LCmOGcmN/H/Hsjd.zI.WcGa2q1KpJANUCPfxePRoNjYXwCRNUC",
      };
      User.findOne = jest.fn().mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue({ ...carles }),
      }));

      bcrypt.compare = jest.fn().mockResolvedValue(true);

      jwt.sign = jest.fn().mockReturnValue(expectedBody.token);

      await loginUser(
        request as CustomRequestCredentials,
        response as Response,
        next
      );

      expect(response.status).toHaveBeenCalledWith(expectedStatus);
      expect(response.json).toHaveBeenCalledWith(expectedBody);
    });
  });

  describe("When it receives a request with incorrect username 'charles'", () => {
    test("Then is should call next function with 'Wrong username' message", async () => {
      const customError = new CustomError(
        "Wrong username!",
        unauthorized,
        "Wrong credentials!"
      );

      User.findOne = jest.fn().mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(false),
      }));

      await loginUser(
        request as CustomRequestCredentials,
        response as Response,
        next
      );

      expect(next).toHaveBeenCalledWith(customError);
    });
  });

  describe("When it receives a request with username 'Carles' wrong password 'galan27'", () => {
    test("Then it should call next function with error message 'Wrong password'", async () => {
      const customError = new CustomError(
        "Wrong password!",
        unauthorized,
        "Wrong credentials!"
      );
      User.findOne = jest.fn().mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue({ ...carles }),
      }));

      bcrypt.compare = jest.fn().mockResolvedValue(false);

      await loginUser(
        request as CustomRequestCredentials,
        response as Response,
        next
      );

      expect(next).toHaveBeenCalledWith(customError);
    });
  });

  describe("When there is a database source error", () => {
    test("Then it should call next function with error message 'Internal server error'", async () => {
      const customError = new CustomError(
        "Error on server response",
        internalServer,
        "Internal server error"
      );

      User.findOne = jest.fn().mockImplementation(() => ({
        exec: jest.fn().mockRejectedValue(customError),
      }));

      await loginUser(
        request as CustomRequestCredentials,
        response as Response,
        next
      );

      expect(next).toHaveBeenCalledWith(customError);
    });
  });
});
