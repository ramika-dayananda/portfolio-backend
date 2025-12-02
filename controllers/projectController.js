const path = require("path");
const fs = require("fs");
const Project = require("../models/Project");

// Helpers
const parseTechnologies = (input) => {
  if (!input) return [];
  if (Array.isArray(input)) return input;
  // If JSON stringified array
  try {
    const parsed = JSON.parse(input);
    if (Array.isArray(parsed)) return parsed.map(String);
  } catch (e) {
    // not JSON
  }
  // comma separated
  if (typeof input === "string") {
    return input.split(",").map((t) => t.trim()).filter(Boolean);
  }
  return [];
};

// GET /api/projects
exports.getAll = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    console.error("getAll projects error:", err);
    res.status(500).json({ message: "Failed to fetch projects" });
  }
};

// GET /api/projects/:id
exports.getOne = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (err) {
    console.error("getOne project error:", err);
    res.status(500).json({ message: "Failed to fetch project" });
  }
};

// POST /api/projects
exports.create = async (req, res) => {
  try {
    const { title, description } = req.body;
    let tech = parseTechnologies(req.body.technologies || req.body.tech);

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    let imagePath = "";
    if (req.file && req.file.filename) {
      imagePath = `/uploads/${req.file.filename}`;
    } else if (req.body.imageUrl) {
      imagePath = req.body.imageUrl;
    }

    const project = await Project.create({
      title: title.trim(),
      description: description.trim(),
      tech,
      image: imagePath,
    });

    res.json(project);
  } catch (err) {
    console.error("create project error:", err);
    res.status(500).json({ message: "Failed to create project" });
  }
};

// PUT /api/projects/:id
exports.update = async (req, res) => {
  try {
    const { title, description } = req.body;
    const tech = parseTechnologies(req.body.technologies || req.body.tech);

    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // If new file uploaded, remove old file
    if (req.file && req.file.filename) {
      if (project.image && project.image.startsWith("/uploads/")) {
        const oldPath = path.join(__dirname, "..", project.image);
        if (fs.existsSync(oldPath)) {
          try { fs.unlinkSync(oldPath); } catch (e) { /* ignore */ }
        }
      }
      project.image = `/uploads/${req.file.filename}`;
    } else if (req.body.imageUrl !== undefined) {
      project.image = req.body.imageUrl || "";
    }

    if (title !== undefined) project.title = title.trim();
    if (description !== undefined) project.description = description.trim();
    if (tech && tech.length) project.tech = tech;

    await project.save();
    res.json(project);
  } catch (err) {
    console.error("update project error:", err);
    res.status(500).json({ message: "Failed to update project" });
  }
};

// DELETE /api/projects/:id
exports.delete = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.image && project.image.startsWith("/uploads/")) {
      const imgPath = path.join(__dirname, "..", project.image);
      if (fs.existsSync(imgPath)) {
        try { fs.unlinkSync(imgPath); } catch (e) { /* ignore */ }
      }
    }

    await project.remove();
    res.json({ message: "Project deleted" });
  } catch (err) {
    console.error("delete project error:", err);
    res.status(500).json({ message: "Failed to delete project" });
  }
};
