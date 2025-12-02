import asyncHandler from 'express-async-handler';
import Contact from '../models/Contact.js';

// GET all contacts
export const getContacts = asyncHandler(async (req, res) => {
  const items = await Contact.find({}).sort({ createdAt: -1 });
  res.json(items);
});

// GET contact by ID
export const getContactById = asyncHandler(async (req, res) => {
  const item = await Contact.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Contact not found');
  }
  res.json(item);
});

// CREATE a contact message
export const createContact = asyncHandler(async (req, res) => {
  const { firstname, lastname, email, message } = req.body;

  const created = await Contact.create({
    firstname,
    lastname,
    email,
    message   // ⭐ MUST SAVE THIS
  });

  res.status(201).json(created);
});

// UPDATE contact message
export const updateContact = asyncHandler(async (req, res) => {
  const item = await Contact.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  if (!item) {
    res.status(404);
    throw new Error('Contact not found');
  }
  res.json(item);
});

// DELETE specific contact
export const deleteContact = asyncHandler(async (req, res) => {
  const item = await Contact.findByIdAndDelete(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Contact not found');
  }
  res.json({ message: 'Contact removed' });
});

// DELETE all contacts
export const deleteAllContacts = asyncHandler(async (req, res) => {
  const result = await Contact.deleteMany({});
  res.json({ deleted: result.deletedCount });
});
