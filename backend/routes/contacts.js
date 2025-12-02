import { Router } from 'express';
import {
  getContacts, getContactById, createContact, updateContact, deleteContact, deleteAllContacts
} from '../controllers/contacts.js';
const router = Router();

router.route('/').get(getContacts).post(createContact).delete(deleteAllContacts);
router.route('/:id').get(getContactById).put(updateContact).delete(deleteContact);

export default router;
