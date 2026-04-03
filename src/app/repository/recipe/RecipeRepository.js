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
      select: "instruction",
    })
    .populate({
      path: "ingredients",
      select: "-_id ingredients",
    });
}

async function createRecipe(user, instruction, ingredients, title) {
  const instructions = await Instruction.create({ instruction });
  if (!instructions) {
    return res.status(401).json({ message: "failed to create instruction" });
  }
  const createdIngredients = await Ingredients.create({ ingredients });
  if (!createdIngredients) {
    return res.status(401).json({ message: "failed to create ingredients" });
  }

  return await Recipes.create({
    user: user._id,
    instruction: instructions._id,
    ingredients: createdIngredients._id,
    title,
  });
}

async function findRecipeByTitle(title) {
  return await Recipes.find({ title })
    .select("user instruction ingredients title")
    .populate({
      path: "user",
      select: "person",
      populate: {
        path: "person",
        select: "-_id first_name middle_name last_name",
      },
    })
    .populate({
      path: "instruction",
      select: "-_id instruction",
    })
    .populate({
      path: "ingredients",
      select: "-_id ingredients",
    });
}
async function findRecipeById(id) {
  return await Recipes.findOne({ _id: id });
}
async function updateRecipe(id, title) {
  return await Recipes.findOneAndUpdate(
    { _id: id },
    { title: title },
    { new: true },
  );
}
async function updatedInstruction(id, instruction) {
  return await Instruction.findOneAndUpdate(
    { _id: id },
    { instruction: instruction },
    { new: true },
  );
}
async function updatedIngredients(id, ingredients) {
  return await Ingredients.findOneAndUpdate(
    { _id: id },
    { ingredients: ingredients },
    { new: true },
  );
}
export default {
  findRecipebyUserName,
  createRecipe,
  findRecipeByTitle,
  findRecipeById,
  updateRecipe,
  updatedInstruction,
  updatedIngredients,
};
