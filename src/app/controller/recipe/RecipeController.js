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
    const { description, ingredients, title } = req.body;
    const { username } = req.principal.UserPrincipal;
    const user = await UserRepository.findUserByUsername(username);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const createdRecipe = await RecipeRepository.createRecipe(
      user,
      description,
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
  const { description, ingredients, title } = req.body;

  if (
    (description === "" && ingredients === "" && title === "") ||
    (description === undefined &&
      ingredients === undefined &&
      title === undefined)
  ) {
    return res.status(400).json({ message: "No fields to update" });
  }

  const recipe = await RecipeRepository.findRecipeById(req.params.id);

  if (!recipe) {
    return res.status(404).json({ message: "Recipe not found" });
  }

  if (description && ingredients && title) {
    try {
      const instructionId = recipe.instruction;
      const ingredientsId = recipe.ingredients;

      const updatedInstruction = await Instruction.findOneAndUpdate(
        { _id: instructionId },
        { description },
        { new: true },
      );

      const updatedIngredients = await Ingredients.findOneAndUpdate(
        { _id: ingredientsId },
        { ingredients },
        { new: true },
      );

      const updatedRecipe = await Recipes.findOneAndUpdate(
        { _id: req.params.id },
        { title },
        { new: true },
      );

      res.status(200).json({
        message: "Recipe updated successfully",
        data: {
          instruction: updatedInstruction,
          ingredients: updatedIngredients,
          recipe: updatedRecipe,
        },
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "INTERNAL SERVER ERROR", error: error.message });
    }
  }
  if (description && !ingredients && !title) {
    try {
      const instructionId = recipe.instruction;

      if (instructionId) {
        const updatedInstruction = await Instruction.findOneAndUpdate(
          { _id: instructionId },
          { description },
          { new: true },
        );

        if (!updatedInstruction) {
          return res.status(404).json({ message: "Instruction not found" });
        }

        return res.status(200).json({
          message: "Instruction updated successfully",
          data: updatedInstruction,
        });
      } else {
        return res
          .status(400)
          .json({ message: "No instruction linked to this recipe" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "INTERNAL SERVER ERROR", error: error.message });
    }
  }
  if (ingredients && !title && !description) {
    try {
      const ingredientsId = recipe.ingredients;
      console.log("ON ingredients update: ", recipe.ingredients);
      if (ingredientsId) {
        const updatedIngredients = await Ingredients.findOneAndUpdate(
          { _id: ingredientsId },
          { ingredients },
          { new: true },
        );
        if (updatedIngredients) {
          const updatedIngredients = await Ingredients.findOneAndUpdate(
            { _id: ingredientsId },
            { ingredients },
            { new: true },
          );
          return res.status(200).json({
            message: "Ingredients updated successfully",
            data: updatedIngredients,
          });
        }
      } else {
        return res
          .status(400)
          .json({ message: "No ingredients linked to this recipe" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "INTERNAL SERVER ERROR", error: error.message });
    }
  }
  if (title && !ingredients && !description) {
    try {
      const updatedRecipe = await Recipes.findOneAndUpdate(
        { _id: req.params.id },
        { title },
        { new: true },
      );
      return res.status(200).json({
        message: "Title updated successfully",
        data: updatedRecipe,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "INTERNAL SERVER ERROR", error: error.message });
    }
  }
}
export default { findAllRecipe, createRecipe, searchRecipe, updateRecipe };
