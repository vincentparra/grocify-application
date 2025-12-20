import express from "express";
import LoginController from "../controller/authentication/LoginController.js";
import UserRegistration from "../controller/authentication/UserRegistration.js";
const router = express.Router();

router.post("/login", LoginController.login);
router.post("/register", UserRegistration);
export default router;
