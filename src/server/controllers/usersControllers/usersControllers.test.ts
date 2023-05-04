import { type Response, type NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  type RegisterCredentials,
  type CustomRequestCredentials,
  type UserCredentials,
  type CustomRegisterRequestCredentials,
} from "../types";
import { loginUser, registerUser } from "./usersControllers";
import statusCodes from "../../utils/statusCodes";
import User from "../../../database/models/User";
import CustomError from "../../../CustomError/CustomError";

const {
  success: { okCode, created },
  clientError: { unauthorized, conflict },
  serverError: { internalServer },
} = statusCodes;

const mockUser: UserCredentials = {
  username: "Carles",
  password: "galan99",
};

const request: Partial<CustomRequestCredentials> = {
  body: mockUser,
};

const mockUserToRegister: RegisterCredentials = {
  username: "Carlitos",
  email: "bla@gmail.com",
  password: "holita",
};

const registerRequest: Partial<CustomRegisterRequestCredentials> = {
  body: mockUserToRegister,
};

const response: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const next: NextFunction = jest.fn();

beforeEach(() => jest.clearAllMocks);

describe("Given the RegisterUser controller", () => {
  describe("When it receives a request with non existing credentials", () => {
    test("Then it should return a response with method status code 201 and method json with message 'user successfully created!' in it", async () => {
      const expectedStatus = created;
      const expectedBody = { message: "user successfully created!" };

      request.body = mockUserToRegister;
      bcrypt.hash = jest
        .fn()
        .mockResolvedValue(
          "$2a$12$3t6jHYnnyvOO9lHAT51tOO7w/ezszf776AWrDXYd7sF8dIQc11d2S"
        );
      User.create = jest.fn().mockResolvedValue(mockUserToRegister);

      await registerUser(
        registerRequest as CustomRegisterRequestCredentials,
        response as Response,
        next
      );

      expect(response.status).toHaveBeenCalledWith(expectedStatus);
      expect(response.json).toHaveBeenCalledWith(expectedBody);
    });
  });
  describe("When there is an error while creating user", () => {
    test("Then it should call next function with error message 'Couldn't create!'", async () => {
      const expectedError = new CustomError(
        "Couldn't create",
        conflict,
        "Couldn't create!"
      );

      User.create = jest.fn().mockRejectedValue(expectedError);

      await registerUser(
        registerRequest as CustomRegisterRequestCredentials,
        response as Response,
        next
      );

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When there is an error while mongoose method", () => {
    test("Then it should call next function with error message 'Couldn't create!'", async () => {
      const expectedError = new CustomError(
        "Couldn't create",
        conflict,
        "Couldn't create!"
      );

      User.create = jest.fn().mockResolvedValue(false);

      await registerUser(
        registerRequest as CustomRegisterRequestCredentials,
        response as Response,
        next
      );

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});

describe("Given the loginUser controller", () => {
  describe("When it receives a request with correct username 'Carles' and password 'galan99'", () => {
    test("Then it should call its response status method with a code 200 and return a token in its body", async () => {
      const expectedStatus = okCode;
      const expectedBody = {
        token: "$2a$12$8S4LCmOGcmN/H/Hsjd.zI.WcGa2q1KpJANUCPfxePRoNjYXwCRNUC",
      };
      User.findOne = jest.fn().mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue({ ...mockUser }),
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
      const expectedError = new CustomError(
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

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When it receives a request with username 'Carles' wrong password 'galan27'", () => {
    test("Then it should call next function with error message 'Wrong password'", async () => {
      const expectedError = new CustomError(
        "Wrong password!",
        unauthorized,
        "Wrong credentials!"
      );
      User.findOne = jest.fn().mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue({ ...mockUser }),
      }));

      bcrypt.compare = jest.fn().mockResolvedValue(false);

      await loginUser(
        request as CustomRequestCredentials,
        response as Response,
        next
      );

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When there is a database source error", () => {
    test("Then it should call next function with error message 'Internal server error'", async () => {
      const expectedError = new CustomError(
        "Error on server response",
        internalServer,
        "Internal server error"
      );

      User.findOne = jest.fn().mockImplementation(() => ({
        exec: jest.fn().mockRejectedValue(expectedError),
      }));

      await loginUser(
        request as CustomRequestCredentials,
        response as Response,
        next
      );

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});
