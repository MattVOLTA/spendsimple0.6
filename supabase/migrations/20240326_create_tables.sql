-- Create the budgets table if it doesn't exist
CREATE TABLE IF NOT EXISTS budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    amount INTEGER NOT NULL
);

-- Drop and recreate the expenses table to ensure correct schema
DROP TABLE IF EXISTS expenses;
CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    description TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    budget_id UUID NOT NULL REFERENCES budgets(id),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    receipt_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_budget
        FOREIGN KEY(budget_id)
        REFERENCES budgets(id)
        ON DELETE CASCADE
);