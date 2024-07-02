import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { response } from "./response";
import { HttpStatusCode } from "axios";
import { AuthService } from "../services/auth";

export const authenticate = () => {
  return async (event: APIGatewayProxyEvent, context: Context, next: any) => {
    try {
      if (!event.headers || !event.headers["Authorization"])
        throw new Error("Unauthorized");

      const authHeader = event.headers["Authorization"];
      const token = authHeader && authHeader.split(" ")[1];

      if (token == null) throw new Error("Unauthorized");

      const payload = AuthService.verify(token) as any;
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds since epoch

      if (currentTime > payload.exp) throw new Error("Token expired");
      if (!payload.user) throw new Error("Unauthorized");

      // Set user to context for use in other functions
      context.clientContext = {
        ...context.clientContext,
        Custom: { userId: payload.user },
      };

      return await next(event, context);
    } catch (error) {
      return response.error(
        error.message,
        undefined,
        HttpStatusCode.Unauthorized
      );
    }
  };
};
