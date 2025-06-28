import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { getProjectBySlug, getAllProjects, getRelatedProjects } from '@/lib/projects';
import ProjectDetail from '@/components/project/ProjectDetail';
import RelatedProjects from '@/components/project/RelatedProjects';
import BackToTop from '@/components/ui/BackToTop';
import { headers } from 'next/headers';

// Force server rendering at request time
export const dynamic = 'force-dynamic';
// Disable caching completely
export const fetchCache = 'force-no-store';
export const revalidate = 0;

// Define the correct params type
type ProjectPageProps = {
  params: {
    slug: string;
  };
};

// This page uses server-side rendering to ensure view counts are dynamic
export default async function ProjectPage({ params }: ProjectPageProps) {
  // Add request headers for cache busting
  const headersList = headers();
  const referer = headersList.get('referer') || 'direct';
  
  const { slug } = params;

  console.log(`Trying to load project with slug: "${slug}"`);

  // Use the projects library function which handles the Supabase connection correctly
  const project = await getProjectBySlug(slug);
    
  if (!project) {
    console.error('Project not found with slug:', slug);
    notFound();
  }
  
  console.log('Project found:', { 
    id: project.id, 
    title: project.title, 
    slug: project.slug,
    viewCount: project.view_count
  });
  
  // Get related projects - also dynamic
  const relatedProjects = await getRelatedProjects(
    project.id, 
    project.category,
    3
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-codGray">
      <ProjectDetail project={project} />

      {relatedProjects.length > 0 && (
        <div className="mt-16 mb-8">
          <RelatedProjects projects={relatedProjects} />
        </div>
      )}

      <BackToTop />
    </div>
  );
}

// Generate metadata dynamically at request time
export async function generateMetadata(
  { params }: ProjectPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Get timestamp to ensure fresh data
  const timestamp = Date.now();
  const { slug } = params;
  
  // Use the getProjectBySlug function which handles Supabase correctly
  const project = await getProjectBySlug(slug);
  
  if (!project) {
    return {
      title: 'Project Not Found',
      description: 'The requested project could not be found.',
    };
  }

  // Ensure OG image is absolute URL
  const imageUrl = project.image_url?.startsWith('http') 
    ? project.image_url 
    : `https://rishia.in/${project.image_url || 'og-image.jpg'}`;

  return {
    title: `${project.title} | Rishi's Portfolio`,
    description: project.description,
    openGraph: {
      title: `${project.title} | Rishi's Portfolio`,
      description: project.description,
      url: `https://rishia.in/projects/${project.slug}`,
      siteName: 'Rishi Ahuja',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
      type: 'website',
    },
  };
}

// Generate paths at build time, but keep the data fetching dynamic
export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}