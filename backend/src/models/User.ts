import pool from '../config/database';

export interface User {
  id: number;
  username: string;
  password_hash: string;
  created_at: Date;
}

export const createUser = async (username: string, passwordHash: string): Promise<number> => {
  const [result] = await pool.execute(
    'INSERT INTO users (username, password_hash) VALUES (?, ?)',
    [username, passwordHash]
  );
  return (result as any).insertId;
};

export const findUserByUsername = async (username: string): Promise<User | null> => {
  const [rows] = await pool.execute(
    'SELECT * FROM users WHERE username = ?',
    [username]
  );
  const users = rows as User[];
  return users.length > 0 ? users[0] : null;
};

export const findUserById = async (id: number): Promise<User | null> => {
  const [rows] = await pool.execute(
    'SELECT id, username, created_at FROM users WHERE id = ?',
    [id]
  );
  const users = rows as User[];
  return users.length > 0 ? users[0] : null;
};

