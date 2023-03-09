interface StatusCode {
  clientError: { notFound: number; badRequest: number; unauthorized: number };
  serverError: {
    internalServer: number;
  };
  success: { okCode: number };
}

export default StatusCode;
