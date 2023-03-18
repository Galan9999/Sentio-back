import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import connectDatabase from "../../../database/connectDatabase";
import { Quote } from "../../../database/models/Quote";
import { app } from "../../app";
import { type QuoteStructure } from "../../controllers/types";
import { mockCustomStructureRequest } from "../../utils/mocks";
import statusCodes from "../../utils/statusCodes";

const quote = mockCustomStructureRequest.body;

const {
  success: { okCode },
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

describe("Given GET '/quotes' endpoint", () => {
  describe("When it receives a request and there is a list of quotes with only one", () => {
    test("Then it should return a response with status code 200 and list of only one quote in the response body", async () => {
      const mockedQuotes: QuoteStructure = {
        author: "Frida Kahlo",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Frida_Kahlo%2C_by_Guillermo_Kahlo.jpg/440px-Frida_Kahlo%2C_by_Guillermo_Kahlo.jpg",
        country: "Mexico",
        quote: "Feet, what do I need them for if I have wings to fly?",
        tags: ["artists"],
        lived: "1907 - 1954",
        backgroundInfo:
          "Frida Kahlo was a Mexican painter known for her self-portraits, which often incorporated elements of her physical and emotional pain.",
      };

      await Quote.create(mockedQuotes);

      const response = await request(app).get(quotesUrl).expect(okCode);

      expect(response.body).toHaveProperty("quotes");
      expect(response.body.quotes).toHaveLength(1);
    });
  });
});

describe("Given DELETE '/delete' endpoint", () => {
  describe("When it receives a request and there is an id on the request params", () => {
    test("Then it should return a response with status code 200 and a message with the author's name deleted in the response body", async () => {
      const { _id: id } = await Quote.create(quote);
      const expectedResult = { message: "Frida Kahlo deleted!" };

      const response = await request(app)
        .delete(`${quotesUrl}/delete/${id.toString()}`)
        .expect(okCode);

      expect(response.body).toStrictEqual(expectedResult);
    });
  });
});
