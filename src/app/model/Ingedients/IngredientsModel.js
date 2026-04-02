import mongoose from "mongoose";

const IngredientsSchema = mongoose.Schema({
  ingredients: [
    {
      name: String,
      quantity: Number,
      unit: String,
    },
  ],
});

const Ingredients = mongoose.model("Ingredients", IngredientsSchema);
export default Ingredients;
