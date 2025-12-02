import { Router } from 'express';
import {
  getProjects, getProjectById, createProject, updateProject, deleteProject, deleteAllProjects
} from '../controllers/projects.js';
import upload from '../../config/multer.js';
const router = Router();

router.route('/').get(getProjects).post(upload.single('image'), createProject).delete(deleteAllProjects);
router.route('/:id').get(getProjectById).put(upload.single('image'), updateProject).delete(deleteProject);

export default router;
