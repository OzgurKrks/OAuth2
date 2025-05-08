import { Router } from 'express';
import { Todo } from '../models/todo.model';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

// Get all todos for the authenticated user
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const todos = await Todo.find({ user: (req.user as any)._id });
    res.json({
      success: true,
      todos,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching todos',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Create a new todo
router.post('/', authenticateJWT, async (req, res) => {
  try {
    const { title, description } = req.body;
    const todo = await Todo.create({
      title,
      description,
      user: (req.user as any)._id,
    });

    res.status(201).json({
      success: true,
      todo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating todo',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Update a todo
router.put('/:id', authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;

    const todo = await Todo.findOneAndUpdate(
      { _id: id, user: (req.user as any)._id },
      { title, description, completed },
      { new: true }
    );

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found',
      });
    }

    res.json({
      success: true,
      todo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating todo',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Delete a todo
router.delete('/:id', authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findOneAndDelete({
      _id: id,
      user: (req.user as any)._id,
    });

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found',
      });
    }

    res.json({
      success: true,
      message: 'Todo deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting todo',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router; 