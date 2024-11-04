-- Update expenses table to use decimal for amount
ALTER TABLE expenses 
ALTER COLUMN amount TYPE decimal(10,2);

-- Update budgets table to use decimal for amount
ALTER TABLE budgets
ALTER COLUMN amount TYPE decimal(10,2);