-- Update expenses table to include date column
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS date DATE NOT NULL DEFAULT CURRENT_DATE;

-- Update existing rows to have today's date if they don't have one
UPDATE expenses SET date = CURRENT_DATE WHERE date IS NULL;