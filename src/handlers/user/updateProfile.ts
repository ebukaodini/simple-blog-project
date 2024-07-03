import "reflect-metadata";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { response, authenticate, validator } from "../../middlewares";
import { UserDto } from "../../dtos/user.dto";
import { UserRepo } from "../../repos/user.repo";
import { MiddlewareService } from "../../services/middleware";

export const handler = MiddlewareService.use(
  [authenticate(), validator(UserDto, "update")],
  async (
    _event: APIGatewayProxyEvent,
    context: Context
  ): Promise<APIGatewayProxyResult> => {
    context.callbackWaitsForEmptyEventLoop = false;

    try {
      const userId = context.clientContext.Custom.userId;
      const data = UserDto.fromJson(JSON.parse(_event.body!));

      const result = await UserRepo.update(userId, data);
      if (result) {
        const user = await UserRepo.findOne(userId);
        return response.success("User profile updated!", UserDto.toJson(user));
      } else {
        return response.error("User profile was not updated!");
      }
    } catch (error: any) {
      return response.error("User not found!", error.message);
    }
  }
);
