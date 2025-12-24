import express from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import {
  getCategoriesByUserId,
  createCategory,
  updateCategory,
  deleteCategory
} from '../models/Category';

const router = express.Router();

router.use(authenticate);

router.get('/', async (req: AuthRequest, res) => {
  try {
    const categories = await getCategoriesByUserId(req.userId!);
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', async (req: AuthRequest, res) => {
  try {
    const { name, color } = req.body;

    if (!name || !color) {
      return res.status(400).json({ error: 'Name and color are required' });
    }

    const categoryId = await createCategory(req.userId!, name, color);
    const categories = await getCategoriesByUserId(req.userId!);
    const newCategory = categories.find(c => c.id === categoryId);

    res.status(201).json(newCategory);
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { name, color, display_order } = req.body;

    if (!name || !color) {
      return res.status(400).json({ error: 'Name and color are required' });
    }

    await updateCategory(parseInt(id), req.userId!, name, color, display_order);
    const categories = await getCategoriesByUserId(req.userId!);
    const updatedCategory = categories.find(c => c.id === parseInt(id));

    res.json(updatedCategory);
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    await deleteCategory(parseInt(id), req.userId!);
    res.json({ message: 'Category deleted' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

