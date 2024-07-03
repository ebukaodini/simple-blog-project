import "reflect-metadata";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { response, validator } from "../../middlewares";
import { UserDto } from "../../dtos/user.dto";
import { UserRepo } from "../../repos/user.repo";
import { MiddlewareService } from "../../services/middleware";
import { PasswordService } from "../../services/password";

export const handler = MiddlewareService.use(
  [validator(UserDto, "create")],
  async (
    event: APIGatewayProxyEvent,
    context: Context
  ): Promise<APIGatewayProxyResult> => {
    context.callbackWaitsForEmptyEventLoop = false;

    try {
      const data = UserDto.fromJson(JSON.parse(event.body!));

      const user = await UserRepo.findOneByEmail(data.email);
      if (user)
        return response.error("User was not created. Email already exists!");

      const result = await UserRepo.create({
        ...data,
        password_hash: await PasswordService.hash(data.password),
      });

      if (result) {
        delete data.password;
        return response.success("User created successfully!", {
          id: result.insertId,
          ...data,
        });
      } else {
        return response.error("User was not created.");
      }
    } catch (error: any) {
      return response.error("User not created!", error.message);
    }
  }
);
