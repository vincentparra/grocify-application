import rateLimit from "express-rate-limit";

const requestLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message:
      "Too many requests from this IP, please try again after 10 minutes.",
  },
});

export default requestLimiter;
