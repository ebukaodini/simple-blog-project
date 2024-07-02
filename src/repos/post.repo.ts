import { ResultSetHeader } from "mysql2";
import { PostDto } from "../dtos/post.dto";
import { Post } from "../entities/post.entity";
import { DatabaseService } from "../services/database";

export class PostRepo {
  private static async createSchema() {
    try {
      await DatabaseService.execute({
        sql: `
        CREATE TABLE IF NOT EXISTS posts (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          title VARCHAR(255) NOT NULL,
          content TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
        );
      `,
      });
    } catch (error) {
      throw error;
    }
  }

  static async create(post: PostDto): Promise<any> {
    try {
      return await this.createSchema().then(async () => {
        return await DatabaseService.execute({
          sql: `INSERT INTO posts (user_id, title, content) VALUES (:user_id, :title, :content)`,
          values: post,
        });
      });
    } catch (error: any) {
      throw error;
    }
  }

  static async findMyPosts(userId: Post["user_id"]): Promise<Post[]> {
    try {
      return await this.createSchema().then(async () => {
        return await DatabaseService.execute({
          sql: `
            SELECT posts.*, users.firstname, users.lastname 
            FROM posts RIGHT JOIN users ON posts.user_id = users.id
            WHERE user_id = :userId;
          `,
          values: { userId },
        }).then((results: any) => {
          return results.map((post: any) => {
            post.created_by = {
              firstname: post.firstname,
              lastname: post.lastname,
            };
            delete post.firstname;
            delete post.lastname;

            return post;
          }) as Post[];
        });
      });
    } catch (error: any) {
      throw error;
    }
  }

  static async delete(postId: Post["id"]): Promise<boolean> {
    try {
      return await this.createSchema().then(async () => {
        return await DatabaseService.execute({
          sql: `DELETE FROM posts WHERE id = :postId;`,
          values: { postId },
        }).then((result: ResultSetHeader) => {
          return result.affectedRows > 0;
        });
      });
    } catch (error: any) {
      throw error;
    }
  }
}
