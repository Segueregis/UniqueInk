/*
  # Add username field to users table
  
  1. Changes
    - Add username column to users table
    - Add unique constraint for username
    - Add username index for faster lookups
*/

ALTER TABLE users ADD COLUMN IF NOT EXISTS username text UNIQUE NOT NULL;
CREATE INDEX IF NOT EXISTS users_username_idx ON users (username);