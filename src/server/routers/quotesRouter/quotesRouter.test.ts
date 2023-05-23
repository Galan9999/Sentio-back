/* eslint@typescript-eslint/naming-convention */
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import connectDatabase from "../../../database/connectDatabase";
import { Quote } from "../../../database/models/Quote";
import { app } from "../../app";
import { type QuoteStructure } from "../../controllers/types";
import { mockCustomQuoteRequest } from "../../utils/mocks";
import statusCodes from "../../utils/statusCodes";

const quote = mockCustomQuoteRequest.body;

const {
  success: { okCode, created },
} = statusCodes;

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
  await Quote.deleteMany();
});

const quotesUrl = "/quotes";
const mockedQuote: QuoteStructure = {
  author: "Frida Kahlo",
  image:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Frida_Kahlo%2C_by_Guillermo_Kahlo.jpg/440px-Frida_Kahlo%2C_by_Guillermo_Kahlo.jpg",
  country: "Mexico",
  quote: "Feet, what do I need them for if I have wings to fly?",
  tags: "artists",
  lived: "1907 - 1954",
  owner: "6408566fc095933dd9f089b2",
  backgroundInfo:
    "Frida Kahlo was a Mexican painter known for her self-portraits, which often incorporated elements of her physical and emotional pain.",
};

describe("Given GET '/quotes' endpoint", () => {
  describe("When it receives a request and there is a list of quotes with only one", () => {
    test("Then it should return a response with status code 200 and list of only one quote in the response body", async () => {
      await Quote.create(mockedQuote);

      const response = await request(app).get(quotesUrl).expect(okCode);

      expect(response.body).toHaveProperty("quotes");
      expect(response.body.quotes).toHaveLength(1);
    });
  });
});

describe("Given DELETE '/delete' endpoint", () => {
  describe("When it receives a request and there is an id '6411df20c656524ed59cd227'", () => {
    test("Then it should return a response with status code 200 and a message with the author's name deleted in the response body", async () => {
      const { _id: id } = await Quote.create(quote);
      const bearerToken =
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NDA4NTY2ZmMwOTU5MzNkZDlmMDg5YjIiLCJpYXQiOjE2NzkyMzg5NDN9.nf7TyY0ymlLkHA9OC6EvK692Fhrl__ASAk27VWbeHIM";
      const expectedResult = { message: "Frida Kahlo deleted!" };

      const response = await request(app)
        .delete(`/quotes/${id.toString()}`)
        // eslint-disable-next-line @typescript-eslint/naming-convention
        .set({ Authorization: bearerToken })
        .expect(okCode);

      expect(response.body).toStrictEqual(expectedResult);
    });
  });
});

describe("Given Create Quote endpoint", () => {
  describe("When it receives a request with `Frida Kahlo`", () => {
    test("Then it should return an object with the property message: `Frida Kahlo created!`", async () => {
      const bearerToken =
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NDA4NTY2ZmMwOTU5MzNkZDlmMDg5YjIiLCJpYXQiOjE2NzkyMzg5NDN9.nf7TyY0ymlLkHA9OC6EvK692Fhrl__ASAk27VWbeHIM";
      const expectedResult = { message: "Frida Kahlo created!" };

      const response = await request(app)
        .post(`/quotes/create`)
        // eslint-disable-next-line @typescript-eslint/naming-convention
        .set({ Authorization: bearerToken })
        .send({
          author: "Frida Kahlo",
          image:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Frida_Kahlo%2C_by_Guillermo_Kahlo.jpg/440px-Frida_Kahlo%2C_by_Guillermo_Kahlo.jpg",
          country: "Mexico",
          quote: "Feet, what do I need them for if I have wings to fly?",
          tags: "artists",
          lived: "1907 - 1954",
          owner: "1234",
          backgroundInfo:
            "Frida Kahlo was a Mexican painter known for her self-portraits, which often incorporated elements of her physical and emotional pain.",
        })
        .expect(created);

      expect(response.body).toStrictEqual(expectedResult);
    });
  });
});
