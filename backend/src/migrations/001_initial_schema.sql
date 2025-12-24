-- Create database (uncomment if needed)
-- CREATE DATABASE IF NOT EXISTS task_manager;
-- USE task_manager;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  color VARCHAR(7) NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_display_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Missions table
CREATE TABLE IF NOT EXISTS missions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  category_id INT NULL,
  title VARCHAR(500) NOT NULL,
  state ENUM('NOT_STARTED', 'COMPLETED') NOT NULL DEFAULT 'NOT_STARTED',
  display_order INT NOT NULL DEFAULT 0,
  cancelled_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_category_id (category_id),
  INDEX idx_display_order (display_order),
  INDEX idx_cancelled_at (cancelled_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mission_id INT NOT NULL,
  title VARCHAR(500) NOT NULL,
  state ENUM('NOT_STARTED', 'COMPLETED') NOT NULL DEFAULT 'NOT_STARTED',
  display_order INT NOT NULL DEFAULT 0,
  cancelled_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (mission_id) REFERENCES missions(id) ON DELETE CASCADE,
  INDEX idx_mission_id (mission_id),
  INDEX idx_display_order (display_order),
  INDEX idx_cancelled_at (cancelled_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Selected tasks table
CREATE TABLE IF NOT EXISTS selected_tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  task_id INT NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_task (user_id, task_id),
  INDEX idx_user_id (user_id),
  INDEX idx_display_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

