import "reflect-metadata";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { authenticate, response, validator } from "../../middlewares";
import { PostDto } from "../../dtos/post.dto";
import { PostRepo } from "../../repos/post.repo";
import { MiddlewareService } from "../../services/middleware";

export const handler = MiddlewareService.use(
  [authenticate(), validator(PostDto, "create")],
  async (
    event: APIGatewayProxyEvent,
    context: Context
  ): Promise<APIGatewayProxyResult> => {
    context.callbackWaitsForEmptyEventLoop = false;

    try {
      const userId = context.clientContext.Custom.userId;

      const data = PostDto.fromJson(JSON.parse(event.body!));
      const result = await PostRepo.create({ ...data, user_id: userId });

      if (result) {
        return response.success("Post created.", {
          id: result.insertId,
          ...data,
        });
      } else {
        return response.error("User was not created.");
      }
    } catch (error: any) {
      return response.error("Post not created!", error.message);
    }
  }
);
