/*
  # Add initial points trigger

  1. Changes
    - Creates a trigger to automatically add 50 InkPoints when a new user is created
    - Adds activity log entry for initial points bonus
  
  2. Security
    - Trigger runs with security definer to ensure proper permissions
*/

-- Create trigger function to add initial points
CREATE OR REPLACE FUNCTION add_initial_points()
RETURNS TRIGGER AS $$
BEGIN
  -- Add initial points to inkpoints_usuario
  INSERT INTO inkpoints_usuario (id_usuario, pontos)
  VALUES (NEW.id, 50);

  -- Log the activity
  INSERT INTO user_activity (user_id, activity_type, metadata)
  VALUES (
    NEW.id,
    'initial_points_bonus',
    jsonb_build_object(
      'points_added', 50,
      'reason', 'Welcome bonus'
    )
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on users table
DROP TRIGGER IF EXISTS add_initial_points_trigger ON users;

CREATE TRIGGER add_initial_points_trigger
  AFTER INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION add_initial_points();