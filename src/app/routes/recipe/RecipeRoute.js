import express from "express";
import Recipe from "../../controller/recipe/RecipeController.js";
import JWTProvider from "../../utils/security/JWTProvider.js";
import requestLimiter from "../../utils/security/limiter/RequestLimiter.js";
const router = express.Router();

//a middleware that limits request sent by user
router.use(requestLimiter);

//this get the recipe of the logged in user
router.get("/get-recipe", JWTProvider.verifyToken, Recipe.findAllRecipe);
//this search recipe by title
router.get("/get-recipe/:title", JWTProvider.verifyToken, Recipe.searchRecipe);
//this create a new recipe
router.post("/create-recipe", JWTProvider.verifyToken, Recipe.createRecipe);

// todo: add update and delete recipe routes

router.put("/update-recipe/:id", JWTProvider.verifyToken, Recipe.updateRecipe);

export default router;
