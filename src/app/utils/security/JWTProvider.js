import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

function GenerateToken(principal) {
  const payload = { UserPrincipal: principal };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
  return token;
}

function verifyToken(req, res, next) {
  const header = req.headers["authorization"];
  const token = header && header.split(" ")[1];
  if (token === null) {
    res.status(401).json({ message: "JWT token not found" });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, principal) => {
    if (err) {
      res
        .status(403)
        .json({ message: "You do not have access to the endpoint" });
    }
    req.principal = principal;
    next();
  });
}

export default { GenerateToken, verifyToken };
