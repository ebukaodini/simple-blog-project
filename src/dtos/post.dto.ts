import { IsNotEmpty } from "class-validator";
import { Post } from "../entities/post.entity";

export class PostDto {
  id?: number;
  user_id?: number;

  @IsNotEmpty({
    message: "Title is required",
    groups: ["create"],
  })
  title: string;

  @IsNotEmpty({
    message: "Content is required",
    groups: ["create"],
  })
  content: string;

  created_at?: Date;

  public static fromJson(data: { [key: string]: any }): PostDto {
    const post: PostDto = new PostDto();

    if (data?.id) post.id = data.id;
    if (data?.user_id) post.user_id = data.user_id;
    if (data?.title) post.title = data.title;
    if (data?.content) post.content = data.content;

    return post;
  }

  public static toJson(post: Post): object {
    if (!post) {
      return;
    }

    return Object.assign(post);
  }

  public static toArray(posts: Post[]): object[] {
    return posts.map((post) => this.toJson(post));
  }
}
