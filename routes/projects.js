const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const projectController = require("../controllers/projectController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Public
router.get("/", projectController.getAll);
router.get("/:id", projectController.getOne);

// Protected (admin)
router.post("/", authMiddleware, adminMiddleware, upload.single("image"), projectController.create);
router.put("/:id", authMiddleware, adminMiddleware, upload.single("image"), projectController.update);
router.delete("/:id", authMiddleware, adminMiddleware, projectController.delete);

module.exports = router;