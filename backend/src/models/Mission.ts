import pool from '../config/database';
import { Task } from './Task';

export interface Mission {
  id: number;
  user_id: number;
  category_id: number | null;
  title: string;
  state: 'NOT_STARTED' | 'COMPLETED';
  display_order: number;
  cancelled_at: Date | null;
  created_at: Date;
  tasks?: Task[];
}

export const getMissionsByUserId = async (userId: number): Promise<Mission[]> => {
  const [rows] = await pool.execute(
    `SELECT m.*, c.display_order as category_order
     FROM missions m
     LEFT JOIN categories c ON m.category_id = c.id
     WHERE m.user_id = ? AND m.cancelled_at IS NULL
     ORDER BY COALESCE(c.display_order, 999999) ASC, m.display_order ASC, m.created_at ASC`,
    [userId]
  );
  return rows as Mission[];
};

export const createMission = async (
  userId: number,
  categoryId: number | null,
  title: string
): Promise<number> => {
  // Get max display_order for user/category
  const [maxOrder] = await pool.execute(
    `SELECT COALESCE(MAX(display_order), 0) as max_order 
     FROM missions 
     WHERE user_id = ? AND (category_id = ? OR (category_id IS NULL AND ? IS NULL))`,
    [userId, categoryId, categoryId]
  );
  const maxOrderValue = (maxOrder as any[])[0]?.max_order || 0;
  
  const [result] = await pool.execute(
    'INSERT INTO missions (user_id, category_id, title, state, display_order) VALUES (?, ?, ?, ?, ?)',
    [userId, categoryId, title, 'NOT_STARTED', maxOrderValue + 1]
  );
  return (result as any).insertId;
};

export const updateMission = async (
  id: number,
  userId: number,
  title?: string,
  categoryId?: number | null,
  state?: 'NOT_STARTED' | 'COMPLETED',
  displayOrder?: number
): Promise<boolean> => {
  const updates: string[] = [];
  const values: any[] = [];
  
  if (title !== undefined) {
    updates.push('title = ?');
    values.push(title);
  }
  if (categoryId !== undefined) {
    updates.push('category_id = ?');
    values.push(categoryId);
  }
  if (state !== undefined) {
    updates.push('state = ?');
    values.push(state);
  }
  if (displayOrder !== undefined) {
    updates.push('display_order = ?');
    values.push(displayOrder);
  }
  
  values.push(id, userId);
  
  await pool.execute(
    `UPDATE missions SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`,
    values
  );
  return true;
};

export const cancelMission = async (id: number, userId: number): Promise<boolean> => {
  await pool.execute(
    'UPDATE missions SET cancelled_at = NOW() WHERE id = ? AND user_id = ?',
    [id, userId]
  );
  return true;
};

export const getMissionById = async (id: number, userId: number): Promise<Mission | null> => {
  const [rows] = await pool.execute(
    'SELECT * FROM missions WHERE id = ? AND user_id = ?',
    [id, userId]
  );
  const missions = rows as Mission[];
  return missions.length > 0 ? missions[0] : null;
};

