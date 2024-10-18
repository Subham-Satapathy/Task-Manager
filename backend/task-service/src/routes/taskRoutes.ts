import express from 'express';
import { getTasks, createTask, updateTask, deleteTask } from '../controllers/taskController';
import authMiddleware from '../middleware/auth';

const router = express.Router();

router.get('/', authMiddleware, getTasks); // Protect the route
router.post('/', authMiddleware, createTask); // Protect the route
router.put('/:id', authMiddleware, updateTask); // Protect the route
router.delete('/:id', authMiddleware, deleteTask); // Protect the route

export default router;
