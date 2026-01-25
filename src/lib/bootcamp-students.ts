import { supabase } from './supabase';

export interface BootcampStudent {
  name: string;
  email?: string;
  college?: string;
  yearOfStudy?: number;
  linkedinProfile: string;
  linkedinPost?: string;
  githubProfile?: string;
  initials: string;
  learningTakeaway?: string;
  consent: boolean;
}

// Fetch approved students from database
export async function getBootcampStudents(): Promise<BootcampStudent[]> {
  const { data, error } = await supabase
    .from('bootcamp_students')
    .select('*')
    .eq('status', 'approved')
    .eq('consent', true)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching bootcamp students:', error);
    return [];
  }

  // Transform database format to expected format
  return data.map(student => ({
    name: student.name,
    email: student.email || undefined,
    college: student.college || undefined,
    yearOfStudy: student.year_of_study || undefined,
    linkedinProfile: student.linkedin_profile,
    linkedinPost: student.linkedin_post || undefined,
    githubProfile: student.github_profile || undefined,
    initials: student.initials,
    learningTakeaway: student.learning_takeaway || undefined,
    consent: student.consent
  }));
}

export async function getStudentCount(): Promise<number> {
  const students = await getBootcampStudents();
  return students.length;
}
