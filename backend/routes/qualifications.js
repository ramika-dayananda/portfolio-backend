import { Router } from 'express';
import {
  getQualifications, getQualificationById, createQualification, updateQualification, deleteQualification, deleteAllQualifications
} from '../controllers/qualifications.js';
const router = Router();

router.route('/').get(getQualifications).post(createQualification).delete(deleteAllQualifications);
router.route('/:id').get(getQualificationById).put(updateQualification).delete(deleteQualification);

export default router;
