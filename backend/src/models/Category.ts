import pool from '../config/database';

export interface Category {
  id: number;
  user_id: number;
  name: string;
  color: string;
  display_order: number;
  created_at: Date;
}

export const getCategoriesByUserId = async (userId: number): Promise<Category[]> => {
  const [rows] = await pool.execute(
    'SELECT * FROM categories WHERE user_id = ? ORDER BY display_order ASC, created_at ASC',
    [userId]
  );
  return rows as Category[];
};

export const createCategory = async (userId: number, name: string, color: string): Promise<number> => {
  // Get max display_order for user
  const [maxOrder] = await pool.execute(
    'SELECT COALESCE(MAX(display_order), 0) as max_order FROM categories WHERE user_id = ?',
    [userId]
  );
  const maxOrderValue = (maxOrder as any[])[0]?.max_order || 0;
  
  const [result] = await pool.execute(
    'INSERT INTO categories (user_id, name, color, display_order) VALUES (?, ?, ?, ?)',
    [userId, name, color, maxOrderValue + 1]
  );
  return (result as any).insertId;
};

export const updateCategory = async (id: number, userId: number, name: string, color: string, displayOrder?: number): Promise<boolean> => {
  if (displayOrder !== undefined) {
    await pool.execute(
      'UPDATE categories SET name = ?, color = ?, display_order = ? WHERE id = ? AND user_id = ?',
      [name, color, displayOrder, id, userId]
    );
  } else {
    await pool.execute(
      'UPDATE categories SET name = ?, color = ? WHERE id = ? AND user_id = ?',
      [name, color, id, userId]
    );
  }
  return true;
};

export const deleteCategory = async (id: number, userId: number): Promise<boolean> => {
  await pool.execute(
    'DELETE FROM categories WHERE id = ? AND user_id = ?',
    [id, userId]
  );
  return true;
};

export const getCategoryById = async (id: number, userId: number): Promise<Category | null> => {
  const [rows] = await pool.execute(
    'SELECT * FROM categories WHERE id = ? AND user_id = ?',
    [id, userId]
  );
  const categories = rows as Category[];
  return categories.length > 0 ? categories[0] : null;
};

