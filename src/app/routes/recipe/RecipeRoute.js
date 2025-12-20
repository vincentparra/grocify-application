import express from "express";
import Recipe from "../../controller/recipe/RecipeController.js";
import JWTProvider from "../../utils/security/JWTProvider.js";
const router = express.Router();

router.get("/get-recipe", JWTProvider.verifyToken, Recipe);

export default router;
