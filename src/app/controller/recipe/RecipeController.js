import DB from "../../config/db.js";
import User from "../../model/User/UserModel.js";
import Recipes from "../../model/Recipe/RecipeModel.js";
import findRecipebyUserName from "../../repository/recipe/RecipeRepository.js";

async function findRecipe(req, res) {
  DB.Connection();
  const { username } = req.body;
  const userRecipe = await findRecipebyUserName(username, res);
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
  }));

  res.status(200).json(recipe);
}

export default findRecipe;
