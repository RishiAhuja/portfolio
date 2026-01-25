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

-- Create bootcamp_students table
CREATE TABLE IF NOT EXISTS bootcamp_students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  linkedin_profile TEXT NOT NULL,
  linkedin_post TEXT,
  initials TEXT NOT NULL,
  consent BOOLEAN DEFAULT true,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE bootcamp_students ENABLE ROW LEVEL SECURITY;

-- Public can read approved students
CREATE POLICY "Public can read approved bootcamp students"
  ON bootcamp_students FOR SELECT
  USING (status = 'approved');

-- Allow authenticated users to manage bootcamp students
CREATE POLICY "Allow bootcamp student management"
  ON bootcamp_students FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_bootcamp_students_status ON bootcamp_students(status);
CREATE INDEX IF NOT EXISTS idx_bootcamp_students_created ON bootcamp_students(created_at);

-- Create updated_at trigger for bootcamp_students
CREATE TRIGGER bootcamp_students_updated_at
  BEFORE UPDATE ON bootcamp_students
  FOR EACH ROW
  EXECUTE FUNCTION update_bootcamp_updated_at();

-- Insert initial approved students
INSERT INTO bootcamp_students (name, linkedin_profile, linkedin_post, initials, status, consent) VALUES
  ('Anshika Verma', 'https://www.linkedin.com/in/anshika-verma-a4353a392', 'https://www.linkedin.com/posts/anshika-verma-a4353a392_flutter-gdgc-appdevelopment-activity-7419788666975182848-nTRu', 'AV', 'approved', true),
  ('Nisha Priya', 'https://www.linkedin.com/in/nisha-priya-66b274384', 'https://www.linkedin.com/posts/nisha-priya-66b274384_flutter-appdevelopment-studentdeveloper-activity-7419762888283824128-Gue2', 'NP', 'approved', true),
  ('Khushi', 'https://www.linkedin.com/in/khushi-aggarwal-1a9425319', 'https://www.linkedin.com/posts/khushi-aggarwal-1a9425319_upskilling-mobileappdev-flutter-activity-7420145499674013696-lTMW', 'K', 'approved', true),
  ('Ashmit Thakur', 'https://www.linkedin.com/in/ashmit-thakur-9481b3325', 'https://www.linkedin.com/posts/ashmit-thakur-9481b3325_utilized-my-winter-break-to-get-started-with-activity-7420148611021295616-8zg1', 'AT', 'approved', true),
  ('Sanket Puri Goswami', 'https://www.linkedin.com/in/sanket-puri-goswami-b90b14371', 'https://www.linkedin.com/posts/sanket-puri-goswami-b90b14371_i-kicked-off-my-app-development-journey-this-activity-7419750647077470208-XjmY', 'SPG', 'approved', true),
  ('Bhumika Gupta', 'https://www.linkedin.com/in/bhumika-gupta-301022322', 'https://www.linkedin.com/posts/bhumika-gupta-301022322_flutter-gdgcnitj-learningbybuilding-activity-7419788072432660481-fm8S?utm_source=share&utm_medium=member_desktop&rcm=ACoAAE8OG0YBW0x_VJWiL5Z6CLmHlpxAa8e5EXE', 'BG', 'approved', true),
  ('Amrit Noor Singh', 'https://www.linkedin.com/in/amrit-noor-singh-414a46326', 'https://www.linkedin.com/posts/amrit-noor-singh-414a46326_flutter-appdevelopment-learningjourney-activity-7420143807591022593-bsdV', 'ANS', 'approved', true),
  ('Ankit', 'https://www.linkedin.com/in/ankit-sheoran-2487a8306', 'https://www.linkedin.com/posts/ankit-sheoran-2487a8306_appdevelopment-bootcamp-studentdeveloper-activity-7419708682847932416-_57c', 'A', 'approved', true),
  ('Disha Sharma', 'https://www.linkedin.com/in/disha-sharma-3593a837b', 'https://www.linkedin.com/posts/disha-sharma-3593a837b_flutter-appdevelopment-gdgc-activity-7419725986126282752-5KBb', 'DS', 'approved', true),
  ('Kavish Garg', 'https://www.linkedin.com/in/kavish0024', 'https://www.linkedin.com/posts/kavish0024_learning-flutter-wasnt-the-hardest-part-activity-7420356537237319680-EfAV', 'KG', 'approved', true),
  ('Sujal Kumar', 'https://www.linkedin.com/in/sujal-gupta-4198b9368', 'https://www.linkedin.com/posts/sujal-gupta-4198b9368_flutter-appdevelopment-gdgc-activity-7419774753781104640-pNLn', 'SK', 'approved', true),
  ('Priyansh Kumar', 'https://www.linkedin.com/in/priyansh-kumar-723421350', 'https://www.linkedin.com/posts/priyansh-kumar-723421350_participating-in-the-recent-campaign-by-gdgc-activity-7420547778298331136-aDCO', 'PK', 'approved', true)
ON CONFLICT DO NOTHING;
