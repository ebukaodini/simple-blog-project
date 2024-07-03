import { APIGatewayProxyResult } from "aws-lambda";
import { HttpStatusCode, AxiosError } from "axios";

export const response = {
  success: (
    message: string,
    data?: any,
    statusCode?: number
  ): APIGatewayProxyResult => {
    console.log("success", message, data, statusCode);
    return {
      statusCode: statusCode ?? HttpStatusCode.Ok,
      body: JSON.stringify({ message, data }),
    };
  },

  error: (
    message: string,
    errors?: any | AxiosError,
    statusCode?: number
  ): APIGatewayProxyResult => {
    console.log("error", message, errors, statusCode);
    if (errors?.response) {
      // Axios Error
      console.log("Axios Error", errors?.response);
      return {
        statusCode: errors?.response.status,
        body: JSON.stringify({ message: errors?.response.statusText }),
      };
    } else {
      console.log("Error", errors);
      return {
        statusCode: statusCode ?? HttpStatusCode.BadRequest,
        body: JSON.stringify({ message, ...{ errors } }),
      };
    }
  },
};
