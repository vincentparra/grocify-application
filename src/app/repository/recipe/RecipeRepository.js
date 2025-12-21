import Recipes from "../../model/Recipe/RecipeModel.js";
import User from "../../model/User/UserModel.js";
import Instructions from "../../model/Instruction/InstructionModel.js";
import Ingredients from "../../model/Ingedients/IngredientsModel.js";
async function findRecipebyUserName(username, res) {
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  return await Recipes.find({ user: user._id })
    .select("person instruction ingredients -_id")
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

export default findRecipebyUserName;
