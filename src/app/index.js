import express from "express";
import dotenv from "dotenv";
import AuthRoute from "./routes/AuthRoute.js";
import RecipeRoute from "./routes/recipe/RecipeRoute.js";
const app = express();
dotenv.config();

app.use(express.json());
app.use("/auth", AuthRoute);
app.use("/recipe", RecipeRoute);

app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
