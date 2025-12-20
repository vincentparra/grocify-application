import jwt from "jsonwebtoken";
import dotenv from "dotenv";
export default function GenerateToken(principal) {
  const payload = { UserPrincipal: principal };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
  return token;
}
