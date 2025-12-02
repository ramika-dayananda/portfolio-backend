import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },

    // Array of tech strings
    tech: {
      type: [String],
      required: true,
      default: []
    },

    // existing image (optional)
    image: {
      type: String,
      default: ""
    },

    // optional image URL/path (used when file uploaded or imageUrl provided)
    imageUrl: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
