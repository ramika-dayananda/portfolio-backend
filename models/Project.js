const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },

    // allow array of strings for technologies
    tech: {
      type: [String],
      required: true,
      default: []
    },

    // image stored as a path (e.g., /uploads/filename.jpg)
    image: {
      type: String,
      required: false,
      default: ""
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
