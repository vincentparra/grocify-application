import DB from "../../config/db.js";
import User from "../../model/User/UserModel.js";
import Recipes from "../../model/Recipe/RecipeModel.js";
import RecipeRepository from "../../repository/recipe/RecipeRepository.js";
import UserRepository from "../../repository/user/UserRepository.js";

async function findRecipe(req, res) {
  try {
    DB.Connection();
    const { username } = req.principal.UserPrincipal;
    const userRecipe = await RecipeRepository.findRecipebyUserName(
      username,
      res
    );
    if (userRecipe.length === 0) {
      return res.status(404).json({ message: "No recipe found for the user" });
    }
    const recipe = userRecipe.map((r) => ({
      name:
        r.user.person.first_name +
        " " +
        r.user.person.middle_name +
        " " +
        r.user.person.last_name,
      instruction: r.instruction,
      ingredients: r.ingredients,
      title: r.title,
    }));

    res.status(200).json(recipe);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
}

async function createRecipe(req, res) {
  try {
    DB.Connection();
    const { description, ingredients, title } = req.body;
    const { username } = req.principal.UserPrincipal;
    const user = await UserRepository.findUserByUsername(username);
    if (!user) {
      return res.status(404).json({
        message: "User no found",
      });
    }

    const createdRecipe = await RecipeRepository.createRecipe(
      user,
      description,
      ingredients,
      title
    );
    if (!createRecipe) {
      return res.status(400).json({
        message: "BAD REQUEST",
      });
    }
    res.status(201).json(createdRecipe);
  } catch (error) {
    res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
}

export default { findRecipe, createRecipe };
