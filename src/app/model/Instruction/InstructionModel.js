import mongoose from "mongoose";

const InstructionsSchema = mongoose.Schema({
  description: {
    type: String,
  },
});

const Instruction = mongoose.model("Instruction", InstructionsSchema);

export default Instruction;
