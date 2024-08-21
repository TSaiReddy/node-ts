import jwt, { JwtPayload } from "jsonwebtoken";

interface TokenPayload extends JwtPayload {
  _id: string;
  email: string;
}

export function generateAccessToken(user: TokenPayload): string {
  const token = jwt.sign(user, process.env.JWT_SECRET as string, {
    expiresIn: "1d",
    algorithm: "RS256",
  });
  return token;
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayload;
  } catch (error) {
    return null;
  }
}
