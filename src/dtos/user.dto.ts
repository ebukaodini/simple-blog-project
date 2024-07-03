import { IsEmail, IsNotEmpty, IsString, IsUUID } from "class-validator";
import { User } from "../entities/user.entity";

export class UserDto {
  id?: number;

  @IsNotEmpty({
    message: "Firstname is required",
    groups: ["create", "update"],
  })
  firstname: string;

  @IsNotEmpty({ message: "Lastname is required", groups: ["create", "update"] })
  lastname: string;

  @IsEmail({}, { message: "Invalid Email", groups: ["create", "sign-in"] })
  @IsNotEmpty({
    message: "Name is required",
    groups: ["create", "sign-in"],
  })
  email: string;

  @IsNotEmpty({
    message: "Password is required",
    groups: ["create", "sign-in"],
  })
  password: string;

  password_hash?: string;
  created_at?: Date;

  public static fromJson(data: { [key: string]: any }): UserDto {
    const user: UserDto = new UserDto();

    if (data?.id) user.id = data.id;
    if (data?.firstname) user.firstname = data.firstname;
    if (data?.lastname) user.lastname = data.lastname;
    if (data?.email) user.email = data.email;
    if (data?.password) user.password = data.password;

    return user;
  }

  public static toJson(user: User): object {
    if (!user) {
      return;
    }

    delete user.password_hash;
    return Object.assign(user);
  }

  public static toArray(users: User[]): object[] {
    return users.map((user) => this.toJson(user));
  }
}
