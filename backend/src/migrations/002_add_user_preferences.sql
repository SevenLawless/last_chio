-- User preferences table for custom theme colors
CREATE TABLE IF NOT EXISTS user_preferences (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  primary_color VARCHAR(7) NOT NULL DEFAULT '#5A9AA8',
  background_base_color VARCHAR(7) NOT NULL DEFAULT '#C4DDE0',
  background_surface_color VARCHAR(7) NOT NULL DEFAULT '#F5E6D3',
  accent_color VARCHAR(7) NOT NULL DEFAULT '#D4A574',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

