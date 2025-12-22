import Recipes from "../../model/Recipe/RecipeModel.js";
import User from "../../model/User/UserModel.js";
import Ingredients from "../../model/Ingedients/IngredientsModel.js";
import Instruction from "../../model/Instruction/InstructionModel.js";
async function findRecipebyUserName(username, res) {
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  return await Recipes.find({ user: user._id })
    .select("instruction ingredients title -_id")
    .populate({
      path: "user",
      select: "person",
      populate: {
        path: "person",
        select: "_id first_name middle_name last_name",
      },
    })
    .populate({
      path: "instruction",
      select: "-_id description",
    })
    .populate({
      path: "ingredients",
      select: "-_id ingredients",
    });
}

async function createRecipe(user, description, ingredients, title) {
  const instruction = await Instruction.create({ description });
  if (!instruction) {
    return res.status(401).json({ message: "failed to create instruction" });
  }
  const createdIngredients = await Ingredients.create({ ingredients });
  if (!createdIngredients) {
    return res.status(401).json({ message: "failed to create ingredients" });
  }

  return await Recipes.create({
    user: user._id,
    instruction: instruction._id,
    ingredients: createdIngredients._id,
    title,
  });
}

export default { findRecipebyUserName, createRecipe };
