import express from "express";
import dotenv from "dotenv";
import AuthRoute from "./routes/AuthRoute.js";

const app = express();
dotenv.config();

app.use(express.json());
app.use("/auth", AuthRoute);

app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
