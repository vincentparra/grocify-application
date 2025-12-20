import mongoose from "mongoose";

const IngredientsSchema = mongoose.Schema({
  ingredients: {
    type: [String],
  },
});

const Ingredients = mongoose.model("Ingredients", IngredientsSchema);
export default Ingredients;
