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
    context.callbackWaitsForEmptyEventLoop = false;

    try {
      const userId = context.clientContext.Custom.userId;
      const user = await UserRepo.findOne(userId);
      if (user) return response.success("User profile.", UserDto.toJson(user));
      else return response.error("User not found!");
    } catch (error: any) {
      return response.error("User not found!", error.message);
    }
  }
);
