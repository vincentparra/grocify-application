import mongoose, { mongo } from "mongoose";
import User from "../User/UserModel.js";
const RecipesSchema = mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  instruction_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Instruction",
  },
  ingredients_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ingredients",
  },
  title: {
    type: String,
  },
});

const Recipes = mongoose.model("Recipes", RecipesSchema);
export default Recipes;
