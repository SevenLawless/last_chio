import express from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import {
  getMissionsByUserId,
  createMission,
  updateMission,
  cancelMission,
  getMissionById
} from '../models/Mission';
import { getCategoryById } from '../models/Category';
import {
  getTasksByMissionId,
  createTask,
  updateTask,
  cancelTask,
  getAllTasksByMissionId,
  getTaskById
} from '../models/Task';

const router = express.Router();

router.use(authenticate);

// Get all missions with tasks
router.get('/', async (req: AuthRequest, res) => {
  try {
    const missions = await getMissionsByUserId(req.userId!);
    
    // Fetch tasks for each mission
    const missionsWithTasks = await Promise.all(
      missions.map(async (mission) => {
        const tasks = await getTasksByMissionId(mission.id);
        return { ...mission, tasks };
      })
    );

    res.json(missionsWithTasks);
  } catch (error) {
    console.error('Get missions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', async (req: AuthRequest, res) => {
  try {
    const { title, category_id } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    // Verify category ownership if category_id is provided
    if (category_id) {
      const category = await getCategoryById(category_id, req.userId!);
      if (!category) {
        return res.status(403).json({ error: 'Unauthorized: Category does not belong to you' });
      }
    }

    const missionId = await createMission(req.userId!, category_id || null, title);
    const mission = await getMissionById(missionId, req.userId!);

    res.status(201).json(mission);
  } catch (error) {
    console.error('Create mission error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { title, category_id, state, display_order } = req.body;

    // Verify mission exists and belongs to user
    const existingMission = await getMissionById(parseInt(id), req.userId!);
    if (!existingMission) {
      return res.status(404).json({ error: 'Mission not found' });
    }

    // Verify category ownership if category_id is provided
    if (category_id !== undefined && category_id !== null) {
      const category = await getCategoryById(category_id, req.userId!);
      if (!category) {
        return res.status(403).json({ error: 'Unauthorized: Category does not belong to you' });
      }
    }

    await updateMission(parseInt(id), req.userId!, title, category_id, state, display_order);
    const mission = await getMissionById(parseInt(id), req.userId!);
    const tasks = await getTasksByMissionId(parseInt(id));

    res.json({ ...mission, tasks });
  } catch (error) {
    console.error('Update mission error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    await cancelMission(parseInt(id), req.userId!);
    res.json({ message: 'Mission cancelled' });
  } catch (error) {
    console.error('Cancel mission error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Task routes
router.post('/:missionId/tasks', async (req: AuthRequest, res) => {
  try {
    const { missionId } = req.params;
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    // Verify mission belongs to user
    const mission = await getMissionById(parseInt(missionId), req.userId!);
    if (!mission) {
      return res.status(404).json({ error: 'Mission not found' });
    }

    const taskId = await createTask(parseInt(missionId), title);
    const task = await getTaskById(taskId);

    res.status(201).json(task);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update task (including state)
router.put('/tasks/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { title, state, display_order } = req.body;

    // Verify task belongs to user's mission
    const task = await getTaskById(parseInt(id));
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const mission = await getMissionById(task.mission_id, req.userId!);
    if (!mission) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await updateTask(parseInt(id), title, state, display_order);

    // Auto-completion: if all sub-tasks are COMPLETED, set parent mission to COMPLETED
    if (state === 'COMPLETED') {
      const allTasks = await getAllTasksByMissionId(task.mission_id);
      // Check if all tasks are COMPLETED (the current task will be COMPLETED after update)
      const allCompleted = allTasks.every(t => t.id === parseInt(id) || t.state === 'COMPLETED');
      if (allCompleted && allTasks.length > 0) {
        await updateMission(task.mission_id, req.userId!, undefined, undefined, 'COMPLETED');
      }
    } else if (state === 'NOT_STARTED') {
      // If any task is NOT_STARTED, mission should be NOT_STARTED
      const mission = await getMissionById(task.mission_id, req.userId!);
      if (mission?.state === 'COMPLETED') {
        await updateMission(task.mission_id, req.userId!, undefined, undefined, 'NOT_STARTED');
      }
    }

    const updatedTask = await getTaskById(parseInt(id));
    res.json(updatedTask);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Cancel task
router.delete('/tasks/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    // Verify task belongs to user's mission
    const task = await getTaskById(parseInt(id));
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const mission = await getMissionById(task.mission_id, req.userId!);
    if (!mission) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await cancelTask(parseInt(id));
    res.json({ message: 'Task cancelled' });
  } catch (error) {
    console.error('Cancel task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

