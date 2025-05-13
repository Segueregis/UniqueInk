/*
  # Add INSERT policy for users table

  1. Security Changes
    - Add policy for authenticated users to:
      - Insert their own user data during signup
*/

CREATE POLICY "Users can insert own data"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);