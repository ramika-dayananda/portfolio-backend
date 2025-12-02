import asyncHandler from 'express-async-handler';
import Qualification from '../models/Qualification.js';

// helper to build absolute URL
const makeAbsolute = (req, url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const pathPart = url.startsWith('/') ? url : `/${url}`;
  return `${req.protocol}://${req.get('host')}${pathPart}`;
};

// GET all qualifications
export const getQualifications = asyncHandler(async (req, res) => {
  const items = await Qualification.find({}).sort({ createdAt: -1 });
  res.json(items.map(i => ({ ...i.toObject(), imageUrl: makeAbsolute(req, i.imageUrl || '') })));
});

// GET one qualification by ID
export const getQualificationById = asyncHandler(async (req, res) => {
  const item = await Qualification.findById(req.params.id);
  if (!item) { 
    res.status(404); 
    throw new Error('Qualification not found'); 
  }
  const out = item.toObject();
  out.imageUrl = makeAbsolute(req, out.imageUrl || '');
  res.json(out);
});

// CREATE qualification
export const createQualification = asyncHandler(async (req, res) => {
  // accept aliases
  const school = (req.body.school ?? req.body.institution ?? '').trim();
  const program = (req.body.program ?? req.body.degree ?? req.body.course ?? '').trim();
  const year = (req.body.year ?? req.body.graduationYear ?? req.body.gradYear ?? '').toString().trim();
  const description = (req.body.description ?? req.body.desc ?? '').trim();

  if (!school || !program || !year || !description) {
    res.status(400);
    throw new Error("All fields (school, program, year, description) are required.");
  }

  const imageRel = req.file ? `/uploads/${req.file.filename}` : (req.body.imageUrl ?? req.body.image ?? '');
  const imageUrl = makeAbsolute(req, imageRel);

  const created = await Qualification.create({
    school,
    program,
    year,
    description,
    imageUrl
  });

  const out = created.toObject();
  out.imageUrl = makeAbsolute(req, out.imageUrl || '');
  res.status(201).json(out);
});

// UPDATE qualification
export const updateQualification = asyncHandler(async (req, res) => {
  const item = await Qualification.findById(req.params.id); 
  if (!item) {
    res.status(404);
    throw new Error('Qualification not found');
  }

  // accept aliases for updates
  if (req.body.school !== undefined || req.body.institution !== undefined) {
    item.school = (req.body.school ?? req.body.institution ?? item.school).trim();
  }
  if (req.body.program !== undefined || req.body.degree !== undefined) {
    item.program = (req.body.program ?? req.body.degree ?? item.program).trim();
  }
  if (req.body.year !== undefined || req.body.graduationYear !== undefined) {
    item.year = (req.body.year ?? req.body.graduationYear ?? item.year).toString().trim();
  }
  if (req.body.description !== undefined || req.body.desc !== undefined) {
    item.description = (req.body.description ?? req.body.desc ?? item.description).trim();
  }

  if (req.file) {
    item.imageUrl = makeAbsolute(req, `/uploads/${req.file.filename}`);
  } else if (req.body.imageUrl !== undefined || req.body.image !== undefined) {
    item.imageUrl = makeAbsolute(req, req.body.imageUrl ?? req.body.image ?? '');
  }

  const saved = await item.save();
  const out = saved.toObject();
  out.imageUrl = makeAbsolute(req, out.imageUrl || '');
  res.json(out);
});

// DELETE one qualification
export const deleteQualification = asyncHandler(async (req, res) => {
  const item = await Qualification.findByIdAndDelete(req.params.id);
  
  if (!item) { 
    res.status(404); 
    throw new Error('Qualification not found'); 
  }

  res.json({ message: 'Qualification removed' });
});

// DELETE all qualifications
export const deleteAllQualifications = asyncHandler(async (req, res) => {
  const result = await Qualification.deleteMany({});
  res.json({ deleted: result.deletedCount });
});
