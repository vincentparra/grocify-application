import rateLimit from "express-rate-limit";
const loginAttemptLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many login attempts. Please try again later.",
  },
});

export default loginAttemptLimiter;
