import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();
const MONGO_URI = process.env.MONGO_URI;

async function Connection() {
  await mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log("DB is connected");
    })
    .catch((error) => {
      console.log("failed to connect", error);
    });
}

async function Disconnection() {
  await mongoose
    .disconnect(MONGO_URI)
    .then(() => {
      console.log("DB is  disconnected");
    })
    .catch((error) => {
      console.log("failed to disconnect", error);
    });
}

export default { Connection, Disconnection };
