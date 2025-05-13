/*
  # Add INSERT policy for purchased_tattoos table

  1. Security Changes
    - Add INSERT policy to allow authenticated users to create purchase records
    - Policy ensures users can only create purchase records for themselves
*/

CREATE POLICY "Users can create own purchase records" 
ON purchased_tattoos
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);