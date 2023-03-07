import CustomError from "./CustomError";

describe("Given the CustomError class", () => {
  describe("When instantiated with the message 'Endpoint not found' status code '404' and publicMessage 'Endpoint not found'", () => {
    test("Then it should have the propierties with the messages and statusCode", () => {
      const expectedError = {
        message: "Endpoint not found",
        statusCode: 404,
        publicMessage: "Endpoint not found",
      };

      const customError = new CustomError(
        expectedError.message,
        expectedError.statusCode,
        expectedError.publicMessage
      );

      expect(customError).toHaveProperty("message", expectedError.message);
      expect(customError).toHaveProperty(
        "statusCode",
        expectedError.statusCode
      );
      expect(customError).toHaveProperty(
        "publicMessage",
        expectedError.publicMessage
      );
    });
  });
});
