import mongoose from "mongoose";

const InstructionsSchema = mongoose.Schema({
  instruction: {
    type: [String],
  },
});

const Instruction = mongoose.model("Instruction", InstructionsSchema);

export default Instruction;
