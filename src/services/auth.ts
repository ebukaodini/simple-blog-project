import { JwtPayload, sign, verify } from "jsonwebtoken";

export class AuthService {
  static sign(payload: object): string {
    return sign(payload, process.env.JWT_SECRET!, { expiresIn: "7d" });
  }

  static verify(token: string): JwtPayload | string {
    return verify(token, process.env.JWT_SECRET!);
  }
}
