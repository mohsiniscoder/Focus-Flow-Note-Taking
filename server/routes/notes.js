import express from 'express';
import Note from '../models/Note.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// GET all notes
router.get('/', authMiddleware, async (req, res) => {
  const notes = await Note.find({ user: req.userId }).sort({ updatedAt: -1 });
  res.json(notes);
});

// POST create note
router.post('/', authMiddleware, async (req, res) => {
  const { title, content, tags } = req.body;
  const note = await Note.create({ user: req.userId, title, content });
  res.json(note);
});

// PUT update note
router.put('/:id', authMiddleware, async (req, res) => {
  const { title, content, tags } = req.body;
  const updated = await Note.findOneAndUpdate(
    { _id: req.params.id, user: req.userId },
    { title, content },
    { new: true }
  );
  res.json(updated);
});

// DELETE note
router.delete('/:id', authMiddleware, async (req, res) => {
  await Note.findOneAndDelete({ _id: req.params.id, user: req.userId });
  res.json({ success: true });
});

export default router;
