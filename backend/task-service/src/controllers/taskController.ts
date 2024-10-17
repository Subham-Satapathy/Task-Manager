import { Request, Response, NextFunction } from 'express';
import Task from '../models/Task';

export const getTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Fetching tasks failed' });
  }
};

export const createTask = async (req: Request, res: Response) => {
  const { title, description, userId } = req.body;

  try {
    const newTask = new Task({ title, description, userId });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: 'Creating task failed' });
  }
};

export const updateTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const task = await Task.findByIdAndUpdate(id, { status }, { new: true });
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return 
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Updating task failed' });
  }
};

export const deleteTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;

  try {
    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return
    }
    res.status(200).json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Deleting task failed' });
  }
};
