import { Request, Response } from 'express';
import Task, { ITask } from '../models/Task';

// Ensure that the functions return Promise<void>
export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    
    const userId = (req as Request & { userId: string }).userId;
    const tasks: ITask[] = await Task.find({ userId: userId }); // Fetch using userId
    console.log('Tasks fetched successfully');
    
    res.status(200).json(tasks);
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ message: 'Failed to fetch tasks.' });
  }
};

export const createTask = async (req: Request, res: Response): Promise<void> => {
  const { title, dueDate, priority } = req.body;

  try {
    const userId = (req as Request & { userId: string }).userId;
    const newTask = new Task({ title, dueDate, priority, userId: userId}); // Use userId here as well
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Creating task failed' });
  }
};

export const updateTask = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const task = await Task.findByIdAndUpdate(id, { status }, { new: true });
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    res.status(200).json(task);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Updating task failed' });
  }
};

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    res.status(200).json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Deleting task failed' });
  }
};
