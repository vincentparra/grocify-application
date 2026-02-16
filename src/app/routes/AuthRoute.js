import express from "express";
import LoginController from "../controller/authentication/LoginController.js";
import UserRegistration from "../controller/authentication/UserRegistration.js";
import loginAttemptLimiter from "../utils/security/limiter/LoginAttempts.js";
import requestLimiter from "../utils/security/limiter/RequestLimiter.js";

const router = express.Router();

router.post("/login", loginAttemptLimiter, LoginController.login);
router.post("/register", requestLimiter, UserRegistration);
export default router;
