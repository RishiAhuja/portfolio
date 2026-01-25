-- Update bootcamp_students table to add more fields
-- Run this after the initial bootcamp-schema.sql

-- Add new columns to bootcamp_students table
ALTER TABLE bootcamp_students
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS college TEXT,
ADD COLUMN IF NOT EXISTS year_of_study INTEGER,
ADD COLUMN IF NOT EXISTS github_profile TEXT,
ADD COLUMN IF NOT EXISTS learning_takeaway TEXT;

-- Add check constraint for year_of_study
ALTER TABLE bootcamp_students
DROP CONSTRAINT IF EXISTS year_of_study_check;

ALTER TABLE bootcamp_students
ADD CONSTRAINT year_of_study_check CHECK (year_of_study IS NULL OR (year_of_study >= 1 AND year_of_study <= 6));

-- Create index for email lookups (for potential future features)
CREATE INDEX IF NOT EXISTS idx_bootcamp_students_email ON bootcamp_students(email);

-- Update existing records with NULL for new fields (they can be updated later if needed)
-- No action needed as ALTER TABLE ADD COLUMN defaults to NULL

COMMENT ON COLUMN bootcamp_students.email IS 'Student contact email address';
COMMENT ON COLUMN bootcamp_students.college IS 'College/University name';
COMMENT ON COLUMN bootcamp_students.year_of_study IS 'Current year of study (1-6)';
COMMENT ON COLUMN bootcamp_students.github_profile IS 'Optional GitHub profile URL';
COMMENT ON COLUMN bootcamp_students.learning_takeaway IS 'Optional description of what they learned from the bootcamp';
