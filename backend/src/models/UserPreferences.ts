import pool from '../config/database';

export interface UserPreferences {
  id: number;
  user_id: number;
  primary_color: string;
  background_base_color: string;
  background_surface_color: string;
  accent_color: string;
  created_at: Date;
  updated_at: Date;
}

export const getUserPreferences = async (userId: number): Promise<UserPreferences | null> => {
  const [rows] = await pool.execute(
    'SELECT * FROM user_preferences WHERE user_id = ?',
    [userId]
  );
  const preferences = rows as UserPreferences[];
  return preferences.length > 0 ? preferences[0] : null;
};

export const createUserPreferences = async (
  userId: number,
  primaryColor: string = '#5A9AA8',
  backgroundBaseColor: string = '#C4DDE0',
  backgroundSurfaceColor: string = '#F5E6D3',
  accentColor: string = '#D4A574'
): Promise<number> => {
  const [result] = await pool.execute(
    `INSERT INTO user_preferences 
     (user_id, primary_color, background_base_color, background_surface_color, accent_color) 
     VALUES (?, ?, ?, ?, ?)`,
    [userId, primaryColor, backgroundBaseColor, backgroundSurfaceColor, accentColor]
  );
  return (result as any).insertId;
};

export const updateUserPreferences = async (
  userId: number,
  primaryColor?: string,
  backgroundBaseColor?: string,
  backgroundSurfaceColor?: string,
  accentColor?: string
): Promise<void> => {
  const updates: string[] = [];
  const values: any[] = [];

  if (primaryColor !== undefined) {
    updates.push('primary_color = ?');
    values.push(primaryColor);
  }
  if (backgroundBaseColor !== undefined) {
    updates.push('background_base_color = ?');
    values.push(backgroundBaseColor);
  }
  if (backgroundSurfaceColor !== undefined) {
    updates.push('background_surface_color = ?');
    values.push(backgroundSurfaceColor);
  }
  if (accentColor !== undefined) {
    updates.push('accent_color = ?');
    values.push(accentColor);
  }

  if (updates.length === 0) {
    return;
  }

  values.push(userId);
  await pool.execute(
    `UPDATE user_preferences SET ${updates.join(', ')} WHERE user_id = ?`,
    values
  );
};

export const getOrCreateUserPreferences = async (userId: number): Promise<UserPreferences> => {
  let preferences = await getUserPreferences(userId);
  if (!preferences) {
    await createUserPreferences(userId);
    preferences = await getUserPreferences(userId);
  }
  if (!preferences) {
    throw new Error('Failed to create user preferences');
  }
  return preferences;
};

