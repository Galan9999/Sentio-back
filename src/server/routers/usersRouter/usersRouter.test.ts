import "../../../loadEnvironment";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import bcrypt from "bcryptjs";
import connectDatabase from "../../../database/connectDatabase";
import User from "../../../database/models/User";
import { app } from "../../app";
import {
  type RegisterCredentials,
  type UserCredentials,
} from "../../controllers/types";
import statusCodes from "../../utils/statusCodes";

const {
  success: { okCode },
  clientError: { unauthorized },
} = statusCodes;

const password = "galan99";

let server: MongoMemoryServer;

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  await connectDatabase(server.getUri());

  const userData: RegisterCredentials = {
    username: "Carles",
    password: await bcrypt.hash(password, 10),
    email: "cece@ece",
  };
  await User.create(userData);
});

afterAll(async () => {
  await server.stop();
  await mongoose.connection.close();
});

const registerUrl = "/users/login";

describe("Given POST 'users/login endpoint", () => {
  describe("When it receives a request with name 'Carles' and password 'galan99'", () => {
    test("Then it should return a response with status code 200", async () => {
      const loginCredentials: UserCredentials = {
        username: "Carles",
        password,
      };

      const response = await request(app)
        .post(registerUrl)
        .send(loginCredentials)
        .expect(okCode);

      expect(response.body).toHaveProperty("token");
    });
  });

  describe("When it receives a request with wrong username 'carlito' and correct password 'galan99'", () => {
    test("Then is should return a response with status 401 and message 'Wrong username'", async () => {
      const loginCredentials: UserCredentials = {
        username: "carlito",
        password,
      };
      const expectedMessage = "Wrong credentials!";

      const response = await request(app)
        .post(registerUrl)
        .send(loginCredentials)
        .expect(unauthorized);

      expect(response.body).toHaveProperty("error", expectedMessage);
    });
  });
});
