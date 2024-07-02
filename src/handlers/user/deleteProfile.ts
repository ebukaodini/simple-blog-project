import "reflect-metadata";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { response, authenticate } from "../../middlewares";
import { UserDto } from "../../dtos/user.dto";
import { UserRepo } from "../../repos/user.repo";
import { MiddlewareService } from "../../services/middleware";

export const handler = MiddlewareService.use(
  [authenticate()],
  async (
    _event: APIGatewayProxyEvent,
    context: Context
  ): Promise<APIGatewayProxyResult> => {
    try {
      const userId = context.clientContext.Custom.userId;
      const result = await UserRepo.delete(userId);

      if (result) return response.success("User profile deleted.");
      else return response.error("User profile not deleted!");
    } catch (error: any) {
      return response.error("User profile not deleted!", error.message);
    }
  }
);
