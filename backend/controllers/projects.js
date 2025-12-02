import asyncHandler from 'express-async-handler';
import Project from '../models/Project.js';

// helper to normalize tech input
const parseTech = (input) => {
  if (!input) return [];
  if (Array.isArray(input)) return input.map(String);
  if (typeof input === 'string') {
    // try JSON first
    try {
      const parsed = JSON.parse(input);
      if (Array.isArray(parsed)) return parsed.map(String);
    } catch (e) {
      // fallback to comma-separated
      return input.split(',').map(s => s.trim()).filter(Boolean);
    }
  }
  return [];
};

// helper to ensure imageUrl is absolute
const makeAbsolute = (req, url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  // ensure leading slash
  const pathPart = url.startsWith('/') ? url : `/${url}`;
  return `${req.protocol}://${req.get('host')}${pathPart}`;
};

export const getProjects = asyncHandler(async (req, res) => {
  const items = await Project.find({}).sort({ createdAt: -1 }).lean();
  const mapped = items.map(i => ({ ...i, imageUrl: makeAbsolute(req, i.imageUrl) }));
  res.json(mapped);
});

export const getProjectById = asyncHandler(async (req, res) => {
  const item = await Project.findById(req.params.id).lean();
  if (!item) { res.status(404); throw new Error('Project not found'); }
  item.imageUrl = makeAbsolute(req, item.imageUrl);
  res.json(item);
});

export const createProject = asyncHandler(async (req, res) => {
  // accept common aliases
  const title = (req.body.title ?? req.body.name ?? req.body.projectTitle ?? '').trim();
  const description = (req.body.description ?? req.body.desc ?? req.body.details ?? '').trim();
  if (!title || !description) { res.status(400); throw new Error('Title and description are required'); }

  const techInput = req.body.tech ?? req.body.technologies ?? req.body.technologiesList ?? [];
  const tech = parseTech(techInput);

  const imageRel = req.file ? `/uploads/${req.file.filename}` : (req.body.imageUrl ?? req.body.image ?? '');
  const imageUrl = makeAbsolute(req, imageRel);

  const created = await Project.create({
    title,
    description,
    tech,
    imageUrl
  });

  const out = created.toObject();
  out.imageUrl = makeAbsolute(req, out.imageUrl);
  res.status(201).json(out);
});

export const updateProject = asyncHandler(async (req, res) => {
  const item = await Project.findById(req.params.id);
  if (!item) { res.status(404); throw new Error('Project not found'); }

  // update fields if provided (accept aliases)
  if (req.body.title !== undefined || req.body.name !== undefined || req.body.projectTitle !== undefined) {
    const newTitle = (req.body.title ?? req.body.name ?? req.body.projectTitle ?? '').trim();
    if (!newTitle) { res.status(400); throw new Error('Title cannot be empty'); }
    item.title = newTitle;
  }

  if (req.body.description !== undefined || req.body.desc !== undefined || req.body.details !== undefined) {
    const newDesc = (req.body.description ?? req.body.desc ?? req.body.details ?? '').trim();
    if (!newDesc) { res.status(400); throw new Error('Description cannot be empty'); }
    item.description = newDesc;
  }

  if (req.body.tech !== undefined || req.body.technologies !== undefined) {
    item.tech = parseTech(req.body.tech ?? req.body.technologies);
  }

  // file takes precedence
  if (req.file) {
    item.imageUrl = makeAbsolute(req, `/uploads/${req.file.filename}`);
  } else if (req.body.imageUrl !== undefined || req.body.image !== undefined) {
    item.imageUrl = makeAbsolute(req, (req.body.imageUrl ?? req.body.image ?? ''));
  }

  const saved = await item.save();
  const out = saved.toObject();
  out.imageUrl = makeAbsolute(req, out.imageUrl);
  res.json(out);
});

export const deleteProject = asyncHandler(async (req, res) => {
  const item = await Project.findByIdAndDelete(req.params.id);
  if (!item) { res.status(404); throw new Error('Project not found'); }
  res.json({ message: 'Project removed' });
});

export const deleteAllProjects = asyncHandler(async (req, res) => {
  const result = await Project.deleteMany({});
  res.json({ deleted: result.deletedCount });
});
