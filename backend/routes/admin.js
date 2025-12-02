import { Router } from "express";
import { createAdmin } from "../controllers/admin.js";

const router = Router();

// Create admin one-time (Thunder Client only)
router.post("/create-admin", createAdmin);

export default router;
