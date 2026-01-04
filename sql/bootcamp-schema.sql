-- Create bootcamp_lectures table for Flutter Bootcamp
CREATE TABLE IF NOT EXISTS bootcamp_lectures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_number INTEGER NOT NULL UNIQUE CHECK (day_number >= 1 AND day_number <= 14),
  title TEXT NOT NULL,
  description TEXT,
  slides_url TEXT,
  video_url TEXT,
  additional_resources JSONB DEFAULT '[]'::jsonb,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE bootcamp_lectures ENABLE ROW LEVEL SECURITY;

-- Public can read published lectures
CREATE POLICY "Public can read published bootcamp lectures"
  ON bootcamp_lectures FOR SELECT
  USING (is_published = true);

-- Allow authenticated users to manage bootcamp lectures
CREATE POLICY "Allow bootcamp lecture management"
  ON bootcamp_lectures FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Insert initial data for 14 days
INSERT INTO bootcamp_lectures (day_number, title, description, is_published) VALUES
  (1, 'Day 1: Introduction to Flutter', 'Getting started with Flutter development, setting up environment, and understanding the basics', false),
  (2, 'Day 2: Dart Fundamentals', 'Deep dive into Dart programming language fundamentals', false),
  (3, 'Day 3: Widgets & Layouts', 'Understanding Flutter widgets and building responsive layouts', false),
  (4, 'Day 4: State Management Basics', 'Introduction to state management in Flutter applications', false),
  (5, 'Day 5: Navigation & Routing', 'Implementing navigation and routing patterns', false),
  (6, 'Day 6: Forms & Validation', 'Building forms and implementing input validation', false),
  (7, 'Day 7: Networking & APIs', 'Working with REST APIs and handling network requests', false),
  (8, 'Day 8: Local Storage', 'Implementing local data persistence strategies', false),
  (9, 'Day 9: Advanced State Management', 'Exploring BLoC, Provider, and other state management solutions', false),
  (10, 'Day 10: Animations', 'Creating beautiful animations in Flutter', false),
  (11, 'Day 11: Firebase Integration', 'Integrating Firebase services into Flutter apps', false),
  (12, 'Day 12: Testing', 'Writing unit tests, widget tests, and integration tests', false),
  (13, 'Day 13: Performance Optimization', 'Optimizing Flutter app performance', false),
  (14, 'Day 14: Deployment & Publishing', 'Building and publishing Flutter apps to app stores', false)
ON CONFLICT (day_number) DO NOTHING;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_bootcamp_lectures_day ON bootcamp_lectures(day_number);
CREATE INDEX IF NOT EXISTS idx_bootcamp_lectures_published ON bootcamp_lectures(is_published);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_bootcamp_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER bootcamp_lectures_updated_at
  BEFORE UPDATE ON bootcamp_lectures
  FOR EACH ROW
  EXECUTE FUNCTION update_bootcamp_updated_at();
