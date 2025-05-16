import express from 'express';
import jwt from 'jsonwebtoken';
import Task from '../models/Task.js';

const router = express.Router();

const auth = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.sendStatus(401);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    res.sendStatus(403);
  }
};

router.use(auth);

router.get('/', async (req, res) => {
  const tasks = await Task.find({ userId: req.userId });
  res.send(tasks);
});

router.post('/', async (req, res) => {
  const task = new Task({ ...req.body, userId: req.userId });
  await task.save();
  res.send(task);
});

router.put('/:id', async (req, res) => {
  const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.send(updated);
});

router.delete('/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.send({ message: "Deleted" });
});

export default router;
