import { Router } from 'express';
import {
  getQualifications, getQualificationById, createQualification, updateQualification, deleteQualification, deleteAllQualifications
} from '../controllers/qualifications.js';
import upload from '../../config/multer.js';
const router = Router();

router.route('/').get(getQualifications).post(upload.single('image'), createQualification).delete(deleteAllQualifications);
router.route('/:id').get(getQualificationById).put(upload.single('image'), updateQualification).delete(deleteQualification);

export default router;