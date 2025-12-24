import pool from '../config/database';

export interface Task {
  id: number;
  mission_id: number;
  title: string;
  state: 'NOT_STARTED' | 'COMPLETED';
  display_order: number;
  cancelled_at: Date | null;
  created_at: Date;
}

export const getTasksByMissionId = async (missionId: number): Promise<Task[]> => {
  const [rows] = await pool.execute(
    'SELECT * FROM tasks WHERE mission_id = ? AND cancelled_at IS NULL ORDER BY display_order ASC, created_at ASC',
    [missionId]
  );
  return rows as Task[];
};

export const createTask = async (missionId: number, title: string): Promise<number> => {
  // Get max display_order for mission
  const [maxOrder] = await pool.execute(
    'SELECT COALESCE(MAX(display_order), 0) as max_order FROM tasks WHERE mission_id = ?',
    [missionId]
  );
  const maxOrderValue = (maxOrder as any[])[0]?.max_order || 0;
  
  const [result] = await pool.execute(
    'INSERT INTO tasks (mission_id, title, state, display_order) VALUES (?, ?, ?, ?)',
    [missionId, title, 'NOT_STARTED', maxOrderValue + 1]
  );
  return (result as any).insertId;
};

export const updateTask = async (
  id: number,
  title?: string,
  state?: 'NOT_STARTED' | 'COMPLETED',
  displayOrder?: number
): Promise<boolean> => {
  const updates: string[] = [];
  const values: any[] = [];
  
  if (title !== undefined) {
    updates.push('title = ?');
    values.push(title);
  }
  if (state !== undefined) {
    updates.push('state = ?');
    values.push(state);
  }
  if (displayOrder !== undefined) {
    updates.push('display_order = ?');
    values.push(displayOrder);
  }
  
  values.push(id);
  
  await pool.execute(
    `UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`,
    values
  );
  return true;
};

export const cancelTask = async (id: number): Promise<boolean> => {
  await pool.execute(
    'UPDATE tasks SET cancelled_at = NOW() WHERE id = ?',
    [id]
  );
  return true;
};

export const getTaskById = async (id: number): Promise<Task | null> => {
  const [rows] = await pool.execute(
    'SELECT * FROM tasks WHERE id = ?',
    [id]
  );
  const tasks = rows as Task[];
  return tasks.length > 0 ? tasks[0] : null;
};

export const getAllTasksByMissionId = async (missionId: number): Promise<Task[]> => {
  const [rows] = await pool.execute(
    'SELECT * FROM tasks WHERE mission_id = ? AND cancelled_at IS NULL',
    [missionId]
  );
  return rows as Task[];
};

export const verifyTaskOwnership = async (taskId: number, userId: number): Promise<boolean> => {
  const [rows] = await pool.execute(
    `SELECT t.id 
     FROM tasks t
     INNER JOIN missions m ON t.mission_id = m.id
     WHERE t.id = ? AND m.user_id = ? AND t.cancelled_at IS NULL`,
    [taskId, userId]
  );
  return (rows as any[]).length > 0;
};

