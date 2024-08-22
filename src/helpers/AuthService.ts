import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";

interface TokenPayload extends JwtPayload {
  _id: string;
  email: string;
}

export default class AuthService {
  static generateToken(user: TokenPayload): string {
    const token = jwt.sign(user, process.env.JWT_SECRET as string, {
      expiresIn: "1d",
      algorithm: "RS256",
    });
    return token;
  }

  static verifyToken(token: string): TokenPayload | null {
    try {
      return jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as TokenPayload;
    } catch (error) {
      return null;
    }
  }

  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }
}
