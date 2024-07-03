import { ResultSetHeader } from "mysql2";
import { UserDto } from "../dtos/user.dto";
import { User } from "../entities/user.entity";
import { DatabaseService } from "../services/database";

export class UserRepo {
  private static async createSchema() {
    try {
      await DatabaseService.execute({
        sql: `
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          firstname VARCHAR(50),
          lastname VARCHAR(50),
          email VARCHAR(100) NOT NULL UNIQUE,
          password_hash CHAR(64) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `,
      });
    } catch (error) {
      throw error;
    }
  }

  static async create(user: UserDto): Promise<any> {
    try {
      return await this.createSchema().then(async () => {
        return await DatabaseService.execute({
          sql: `INSERT INTO users (firstname, lastname, email, password_hash) VALUES (:firstname, :lastname, :email, :password_hash)`,
          values: user,
        });
      });
    } catch (error: any) {
      throw error;
    }
  }

  static async findAll(): Promise<User[]> {
    try {
      return await this.createSchema().then(async () => {
        return await DatabaseService.execute({
          sql: `SELECT * FROM users;`,
        }).then((results: any) => {
          return results as User[];
        });
      });
    } catch (error: any) {
      throw error;
    }
  }

  static async findOne(userId: User["id"]): Promise<User> {
    try {
      return await this.createSchema().then(async () => {
        return await DatabaseService.execute({
          sql: `SELECT * FROM users WHERE id = :userId LIMIT 1;`,
          values: { userId },
        }).then((results: any) => {
          return results[0] as User;
        });
      });
    } catch (error: any) {
      throw error;
    }
  }

  static async findOneByEmail(email: User["email"]): Promise<User> {
    try {
      console.log("findOneByEmail", email);
      return await this.createSchema().then(async () => {
        return await DatabaseService.execute({
          sql: `SELECT * FROM users WHERE email = :email LIMIT 1;`,
          values: { email },
        }).then((results: any) => {
          return results[0] as User;
        });
      });
    } catch (error: any) {
      throw error;
    }
  }

  static async update(userId: User["id"], user: UserDto): Promise<boolean> {
    try {
      return await this.createSchema().then(async () => {
        return await DatabaseService.execute({
          sql: `UPDATE users SET firstname = :firstname, lastname = :lastname WHERE id = :userId;`,
          values: { ...user, userId },
        }).then((results: ResultSetHeader) => {
          return results.affectedRows > 0;
        });
      });
    } catch (error: any) {
      throw error;
    }
  }

  static async delete(userId: User["id"]): Promise<boolean> {
    try {
      return await this.createSchema().then(async () => {
        return await DatabaseService.execute({
          sql: `DELETE FROM users WHERE id = :userId LIMIT 1;`,
          values: { userId },
        }).then((result: ResultSetHeader) => {
          return result.affectedRows > 0;
        });
      });
    } catch (error: any) {
      throw error;
    }
  }
}
