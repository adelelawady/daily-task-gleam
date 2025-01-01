/*
  # Task Management Schema

  1. New Tables
    - `tasks`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `title` (text)
      - `description` (text)
      - `created_at` (timestamp with time zone)
    
    - `task_history`
      - `id` (uuid, primary key)
      - `task_id` (uuid, references tasks)
      - `user_id` (uuid, references auth.users)
      - `status` (text)
      - `date` (date)
      - `created_at` (timestamp with time zone)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
*/

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  title text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create task_history table
CREATE TABLE IF NOT EXISTS task_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES tasks ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL,
  status text NOT NULL,
  date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(task_id, date)
);

-- Create an enum for task status
CREATE TYPE task_status AS ENUM ('Success', 'High', 'Medium', 'Low', 'Failed');

-- Modify the task_history table to use the enum
ALTER TABLE task_history 
  ALTER COLUMN status TYPE task_status 
  USING status::task_status;

-- Add a constraint to ensure only one status per task per day
ALTER TABLE task_history
  ADD CONSTRAINT unique_task_status_per_day 
  UNIQUE (task_id, date);

-- Add a trigger to update existing status if one exists for the day
CREATE OR REPLACE FUNCTION update_task_status()
RETURNS TRIGGER AS $$
BEGIN
  -- If a status already exists for this task on this date, update it
  UPDATE task_history
  SET status = NEW.status,
      created_at = NOW()
  WHERE task_id = NEW.task_id 
    AND date = NEW.date;
    
  -- If no update was made (no existing record), insert the new one
  IF NOT FOUND THEN
    RETURN NEW;
  END IF;
  
  -- If we updated an existing record, skip the insert
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER task_status_upsert
  BEFORE INSERT ON task_history
  FOR EACH ROW
  EXECUTE FUNCTION update_task_status();

-- Enable RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_history ENABLE ROW LEVEL SECURITY;

-- Tasks policies
CREATE POLICY "Users can view their own tasks"
  ON tasks FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tasks"
  ON tasks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks"
  ON tasks FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks"
  ON tasks FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Task history policies
CREATE POLICY "Users can view their task history"
  ON task_history FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their task history"
  ON task_history FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their task history"
  ON task_history FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their task history"
  ON task_history FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);