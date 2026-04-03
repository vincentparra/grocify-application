import DB from "../../utils/config/db.js";
import RecipeRepository from "../../repository/recipe/RecipeRepository.js";
import UserRepository from "../../repository/user/UserRepository.js";
import Instruction from "../../model/Instruction/InstructionModel.js";
import Ingredients from "../../model/Ingedients/IngredientsModel.js";
import Recipes from "../../model/Recipe/RecipeModel.js";

async function findAllRecipe(req, res) {
  try {
    DB.Connection();
    const { username } = req.principal.UserPrincipal;
    const userRecipe = await RecipeRepository.findRecipebyUserName(
      username,
      res,
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
    const { instruction, ingredients, title } = req.body;
    const { username } = req.principal.UserPrincipal;
    const user = await UserRepository.findUserByUsername(username);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const createdRecipe = await RecipeRepository.createRecipe(
      user,
      instruction,
      ingredients,
      title,
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

async function searchRecipe(req, res) {
  DB.Connection();
  const title = req.params.title.trim();

  const searchRecipe = await RecipeRepository.findRecipeByTitle(title);

  if (!searchRecipe || searchRecipe.length === 0) {
    res.status(404).json({ message: "Recipe not found" });
  }

  const recipe = searchRecipe.map((r) => ({
    name:
      r.user.person.first_name +
      " " +
      r.user.person.middle_name +
      " " +
      r.user.person.last_name,
    instruction: r.instruction,
    ingredients: r.ingredients,
    title: r.title,
    id: r._id,
  }));
  res.status(200).json(recipe);
}

async function updateRecipe(req, res) {
  DB.Connection();
  const { instruction, ingredients, title } = req.body;

  if (
    (instruction === "" && ingredients === "" && title === "") ||
    (instruction === undefined &&
      ingredients === undefined &&
      title === undefined)
  ) {
    return res.status(400).json({ message: "No fields to update" });
  }

  const recipe = await RecipeRepository.findRecipeById(req.params.id);

  if (!recipe) {
    return res.status(404).json({ message: "Recipe not found" });
  }

  const instructionId = recipe.instruction;
  const ingredientsId = recipe.ingredients;
  const updates = {};
  if (instruction) {
    updates.instruction = instruction;
  }

  if (instruction && ingredients && title) {
    try {
      updates.updatedInstruction = await Instruction.findOneAndUpdate(
        { _id: instructionId },
        { instruction },
        { new: true },
      );

      updates.updatedIngredients = await RecipeRepository.updatedIngredients(
        ingredientsId,
        ingredients,
      );

      updates.instructionupdatedRecipe = await RecipeRepository.updateRecipe(
        req.params.id,
        title,
      );

      res.status(200).json({
        message: "Recipe updated successfully",
        data: {
          instruction: updates.updatedInstruction,
          ingredients: updates.updatedIngredients,
          recipe: updates.updatedRecipe,
        },
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "INTERNAL SERVER ERROR", error: error.message });
    }
  }

  if (title) {
    try {
      updates.updatedRecipe = await RecipeRepository.updateRecipe(
        req.params.id,
        title,
      );
      return res.status(200).json({
        message: "Title Updated Successfully",
        data: { Title: updates.updatedRecipe },
      });
    } catch (error) {}
  }

  if (ingredients) {
    try {
      updates.updatedIngredients = await RecipeRepository.updatedIngredients(
        ingredientsId,
        ingredients,
      );
      return res.status(200).json({
        message: "Ingredients Updated Successfully",
        data: { ingredients: updates.updatedIngredients },
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "INTERNAL SERVER ERROR", error: error.message });
    }
  }

  if (instruction) {
    try {
      updates.updatedInstruction = await RecipeRepository.updatedInstruction(
        instructionId,
        instruction,
      );
      return res.status(200).json({
        message: "Instruction Updated Successfully",
        data: { instruction: updates.updatedInstruction },
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "INTERNAL SERVER ERROR", error: error.message });
    }
  }
}
export default { findAllRecipe, createRecipe, searchRecipe, updateRecipe };
