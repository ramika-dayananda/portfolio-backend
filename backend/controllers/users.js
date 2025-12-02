import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

export const getUsers = asyncHandler(async (req, res) => {
  const items = await User.find({}).select('-password').sort({ createdAt: -1 });
  res.json(items);
});

export const getUserById = asyncHandler(async (req, res) => {
  const item = await User.findById(req.params.id).select('-password');
  if (!item) { res.status(404); throw new Error('User not found'); }
  res.json(item);
});

export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) { res.status(400); throw new Error('User already exists'); }
  const created = await User.create({ name, email, password });
  res.status(201).json({ _id: created._id, name: created.name, email: created.email });
});

export const updateUser = asyncHandler(async (req, res) => {
  const item = await User.findById(req.params.id);
  if (!item) { res.status(404); throw new Error('User not found'); }
  item.name = req.body.name ?? item.name;
  item.email = req.body.email ?? item.email;
  if (req.body.password) item.password = req.body.password;
  item.updated = new Date();
  const saved = await item.save();
  res.json({ _id: saved._id, name: saved.name, email: saved.email, updated: saved.updated });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const item = await User.findByIdAndDelete(req.params.id);
  if (!item) { res.status(404); throw new Error('User not found'); }
  res.json({ message: 'User removed' });
});

export const deleteAllUsers = asyncHandler(async (req, res) => {
  const result = await User.deleteMany({});
  res.json({ deleted: result.deletedCount });
});
