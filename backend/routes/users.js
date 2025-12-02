import { Router } from 'express';
import {
  getUsers, getUserById, createUser, updateUser, deleteUser, deleteAllUsers
} from '../controllers/users.js';
import { protect } from '../middleware/auth.js';
const router = Router();

router.route('/').get(getUsers).post(createUser).delete(deleteAllUsers);
router.route('/:id').get(getUserById).put(updateUser).delete(deleteUser);

// example protected route
router.get('/me/profile', protect, (req, res) => res.json(req.user));

export default router;
