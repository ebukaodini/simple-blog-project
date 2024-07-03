import "reflect-metadata";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { response, validator } from "../../middlewares";
import { MiddlewareService } from "../../services/middleware";
import { PasswordService } from "../../services/password";
import { UserRepo } from "../../repos/user.repo";
import { AuthService } from "../../services/auth";
import { UserDto } from "../../dtos/user.dto";
import { HttpStatusCode } from "axios";

export const handler = MiddlewareService.use(
  [validator(UserDto, "sign-in")],
  async (
    event: APIGatewayProxyEvent,
    _context: Context
  ): Promise<APIGatewayProxyResult> => {
    try {
      const data = UserDto.fromJson(JSON.parse(event.body!));
      const { email, password: uPassword } = data;

      return await UserRepo.findOneByEmail(email).then(async (result) => {
        if (
          result &&
          (await PasswordService.verify(uPassword, result.password_hash))
        ) {
          const token = AuthService.sign({
            user: result.id,
          });

          console.log("token", token);
          // return response.success("Login successful!", {
          //   token,
          // });

          return {
            statusCode: HttpStatusCode.Ok,
            body: JSON.stringify({
              message: "Login successful!",
              data: { token },
            }),
          };
        } else {
          return response.error("Invalid email / password!");
        }
      });
    } catch (error: any) {
      return response.error("Invalid email / password!", error.message);
    }
  }
);
