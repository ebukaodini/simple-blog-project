import "reflect-metadata";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { response, authenticate } from "../../middlewares";
import { MiddlewareService } from "../../services/middleware";
import { PostRepo } from "../../repos/post.repo";

export const handler = MiddlewareService.use(
  [authenticate()],
  async (
    event: APIGatewayProxyEvent,
    context: Context
  ): Promise<APIGatewayProxyResult> => {
    context.callbackWaitsForEmptyEventLoop = false;

    try {
      const postId = Number(event.pathParameters.postId!);
      const result = await PostRepo.delete(postId);

      if (result) return response.success("Post deleted.");
      else return response.error("Post not deleted!");
    } catch (error: any) {
      return response.error("Post not deleted!", error.message);
    }
  }
);
