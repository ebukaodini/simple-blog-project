import { generate, verify } from "password-hash";

export class PasswordService {
  static async hash(password: string): Promise<string> {
    const hashedPassword = generate(password, { saltLength: 10 });
    return hashedPassword;
  }

  static async verify(
    password: string,
    passwordHash: string
  ): Promise<boolean> {
    return verify(password, passwordHash);
  }
}
