import express from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import pool from '../config/database';
import { getTaskById, verifyTaskOwnership } from '../models/Task';

const router = express.Router();

router.use(authenticate);

interface SelectedTask {
  id: number;
  user_id: number;
  task_id: number;
  display_order: number;
  created_at: Date;
}

// Get user's selected tasks
router.get('/', async (req: AuthRequest, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT st.*, t.title, t.state, t.mission_id, m.title as mission_title
       FROM selected_tasks st
       INNER JOIN tasks t ON st.task_id = t.id
       INNER JOIN missions m ON t.mission_id = m.id
       WHERE st.user_id = ? AND t.cancelled_at IS NULL
       ORDER BY st.display_order ASC, st.created_at ASC`,
      [req.userId!]
    );
    res.json(rows);
  } catch (error) {
    console.error('Get selected tasks error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add task to selected
router.post('/', async (req: AuthRequest, res) => {
  try {
    const { task_id } = req.body;

    if (!task_id) {
      return res.status(400).json({ error: 'task_id is required' });
    }

    // Verify task exists and belongs to user's mission
    const task = await getTaskById(task_id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Verify task ownership
    const isOwner = await verifyTaskOwnership(task_id, req.userId!);
    if (!isOwner) {
      return res.status(403).json({ error: 'Unauthorized: Task does not belong to you' });
    }

    // Check if task is already selected
    const [existing] = await pool.execute(
      'SELECT * FROM selected_tasks WHERE user_id = ? AND task_id = ?',
      [req.userId!, task_id]
    );

    if ((existing as any[]).length > 0) {
      return res.status(400).json({ error: 'Task already selected' });
    }

    // Get max display_order
    const [maxOrder] = await pool.execute(
      'SELECT COALESCE(MAX(display_order), 0) as max_order FROM selected_tasks WHERE user_id = ?',
      [req.userId!]
    );
    const maxOrderValue = (maxOrder as any[])[0]?.max_order || 0;

    const [result] = await pool.execute(
      'INSERT INTO selected_tasks (user_id, task_id, display_order) VALUES (?, ?, ?)',
      [req.userId!, task_id, maxOrderValue + 1]
    );

    const [newSelected] = await pool.execute(
      `SELECT st.*, t.title, t.state, t.mission_id, m.title as mission_title
       FROM selected_tasks st
       INNER JOIN tasks t ON st.task_id = t.id
       INNER JOIN missions m ON t.mission_id = m.id
       WHERE st.id = ?`,
      [(result as any).insertId]
    );

    res.status(201).json((newSelected as any[])[0]);
  } catch (error) {
    console.error('Add selected task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Remove from selected
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    await pool.execute(
      'DELETE FROM selected_tasks WHERE id = ? AND user_id = ?',
      [id, req.userId!]
    );

    res.json({ message: 'Task removed from selected' });
  } catch (error) {
    console.error('Remove selected task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Reorder selected tasks
router.put('/reorder', async (req: AuthRequest, res) => {
  try {
    const { tasks } = req.body; // Array of { id, display_order }

    if (!Array.isArray(tasks)) {
      return res.status(400).json({ error: 'tasks array is required' });
    }

    // Verify all selected task IDs belong to the current user
    const selectedTaskIds = tasks.map(t => t.id);
    if (selectedTaskIds.length === 0) {
      return res.status(400).json({ error: 'No tasks provided' });
    }

    const placeholders = selectedTaskIds.map(() => '?').join(',');
    const [userSelectedTasks] = await pool.execute(
      `SELECT id FROM selected_tasks WHERE id IN (${placeholders}) AND user_id = ?`,
      [...selectedTaskIds, req.userId!]
    );

    const userTaskIds = (userSelectedTasks as any[]).map(t => t.id);
    const allBelongToUser = selectedTaskIds.every(id => userTaskIds.includes(id));

    if (!allBelongToUser) {
      return res.status(403).json({ error: 'Unauthorized: Some tasks do not belong to you' });
    }

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      for (const task of tasks) {
        await connection.execute(
          'UPDATE selected_tasks SET display_order = ? WHERE id = ? AND user_id = ?',
          [task.display_order, task.id, req.userId!]
        );
      }

      await connection.commit();
      connection.release();

      // Return updated list
      const [rows] = await pool.execute(
        `SELECT st.*, t.title, t.state, t.mission_id, m.title as mission_title
         FROM selected_tasks st
         INNER JOIN tasks t ON st.task_id = t.id
         INNER JOIN missions m ON t.mission_id = m.id
         WHERE st.user_id = ? AND t.cancelled_at IS NULL
         ORDER BY st.display_order ASC, st.created_at ASC`,
        [req.userId!]
      );

      res.json(rows);
    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }
  } catch (error) {
    console.error('Reorder selected tasks error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

