import "reflect-metadata";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { response, authenticate } from "../../middlewares";
import { PostDto } from "../../dtos/post.dto";
import { PostRepo } from "../../repos/post.repo";
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
      const posts = await PostRepo.findMyPosts(userId);

      if (posts) return response.success("My posts.", PostDto.toArray(posts));
      else return response.error("Posts not found!");
    } catch (error: any) {
      return response.error("Posts not found!", error.message);
    }
  }
);
