import "../../../loadEnvironment";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import bycrypt from "bcryptjs";
import connectDatabase from "../../../database/connectDatabase";
import User from "../../../database/models/User";
import { app } from "../../app";
import {
  type RegisterCredentials,
  type UserCredentials,
} from "../../controllers/types";
import statusCodes from "../../utils/statusCodes";

const {
  success: { okCode, created },
  clientError: { unauthorized, conflict },
} = statusCodes;

const saltLenght = 8;
const mockedRegisterCredentials: RegisterCredentials = {
  username: "Carles",
  password: "galan9999",
  email: "cece@ece",
};

let server: MongoMemoryServer;

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  await connectDatabase(server.getUri());
});

afterAll(async () => {
  await server.stop();
  await mongoose.connection.close();
});

afterEach(async () => {
  await User.deleteMany();
});

const loginUrl = "/users/login";
const registerUrl = "/users/register";

describe("Given POST 'users/login endpoint", () => {
  describe("When it receives a request with name 'Carles' and password 'galan99'", () => {
    test("Then it should return a response with status code 200", async () => {
      const loginCredentials: UserCredentials = {
        username: "Carles",
        password: "galan9999",
      };

      const hashedPassword = await bycrypt.hash(
        loginCredentials.password,
        saltLenght
      );

      await User.create({ ...loginCredentials, password: hashedPassword });

      const response = await request(app)
        .post(loginUrl)
        .send(loginCredentials)
        .expect(okCode);

      expect(response.body).toHaveProperty("token");
    });
  });

  describe("When it receives a request with wrong username 'carlito' and correct password 'galan99'", () => {
    test("Then is should return a response with status 401 and message 'Wrong username'", async () => {
      const loginCredentials: UserCredentials = {
        username: "carlito",
        password: "",
      };
      const expectedMessage = "Wrong credentials!";

      const response = await request(app)
        .post(loginUrl)
        .send(loginCredentials)
        .expect(unauthorized);

      expect(response.body).toHaveProperty("error", expectedMessage);
    });
  });
});

describe("Given the POST users/register endpoint", () => {
  describe("When it receives a request with username 'Carles' password 'galan9999' and email 'cece@ece'", () => {
    test("Tehn it should return a response with status 201 and a message 'user successfully created!'", async () => {
      const expectedMessage = "user successfully created!";

      const response = await request(app)
        .post(registerUrl)
        .send(mockedRegisterCredentials)
        .expect(created);

      expect(response.body).toStrictEqual({
        message: expectedMessage,
      });
    });
  });

  describe("When there is a problem creating the user", () => {
    test("Tehn it should return a response with status 409 and a message 'couldn't create'", async () => {
      const expectedMessage = "couldn't create";

      const response = await request(app)
        .post(registerUrl)
        .send(undefined)
        .expect(conflict);

      expect(response.body).toHaveProperty("error", expectedMessage);
    });
  });
});
