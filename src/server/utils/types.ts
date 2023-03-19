interface StatusCode {
  clientError: {
    notFound: number;
    badRequest: number;
    unauthorized: number;
    conflict: number;
  };
  serverError: {
    internalServer: number;
  };
  success: { okCode: number };
}

export default StatusCode;
