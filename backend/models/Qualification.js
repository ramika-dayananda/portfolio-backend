import mongoose from "mongoose";

const qualificationSchema = new mongoose.Schema(
  {
    school: { type: String, required: true },
    program: { type: String, required: true },
    year: { type: String, required: true },
    description: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model("Qualification", qualificationSchema);
