import Recipe from "../../model/Recipe/RecipeModel.js";
import DB from "../../config/db.js";
async function findRecipe(req, res) {
  DB.Connection();
  const recipe = await Recipe.find();
  res.json({ message: recipe });
}

export default findRecipe;
