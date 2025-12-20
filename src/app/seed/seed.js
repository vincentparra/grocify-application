import mongoose from "mongoose";
import DB from "../config/db.js";
import bcrypt from "bcrypt";
import Ingredients from "../model/Ingedients/IngredientsModel.js";
import Instruction from "../model/Instruction/InstructionModel.js";
import Recipes from "../model/Recipe/RecipeModel.js";
import User from "../model/User/UserModel.js";
import Person from "../model/Person/PersonModel.js";
async function seed() {
  DB.Connection();

  await Ingredients.deleteMany({});
  await Instruction.deleteMany({});
  await Recipes.deleteMany({});

  const person = await Person.insertMany([
    {
      first_name: "John",
      middle_name: "Malasakit",
      last_name: "Doe",
      email: "jdMalasakit@gmail.com",
      birth_date: "2003-09-11",
      username: "malasAtsakit",
      password: "securePassword123",
    },
  ]);
  const hashedPassword = await bcrypt.hash("hashedPassword123", 12);
  const users = await User.insertMany([
    {
      person_id: person[0]._id,
      username: "malaSakit",
      password: hashedPassword,
    },
  ]);

  const ingredientsList = await Ingredients.insertMany([
    { ingredients: ["Flour", "Sugar", "Eggs"] },
    { ingredients: ["Tomato", "Salt", "Olive Oil"] },
  ]);
  const instructionsList = await Instruction.insertMany([
    { description: "Mix all ingredients and bake for 30 mins." },
    { description: "Chop vegetables and cook over medium heat." },
  ]);
  const recipes = await Recipes.insertMany([
    {
      user_id: users[0]._id,
      ingredients_id: ingredientsList[0]._id,
      instruction_id: instructionsList[0]._id,
      title: "Simple Cake",
    },
    {
      user_id: users[0]._id,
      ingredients_id: ingredientsList[0]._id,
      instruction_id: instructionsList[0]._id,
      title: "Tomato Stir Fry",
    },
  ]);
  console.log("Seed completed successfully!");
  console.log({ users, ingredientsList, instructionsList, recipes });
}

seed();
