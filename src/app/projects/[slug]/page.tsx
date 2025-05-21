import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProjectBySlug, getAllProjects, getRelatedProjects } from '@/lib/projects';
import ProjectDetail from '@/components/project/ProjectDetail';
import RelatedProjects from '@/components/project/RelatedProjects';
import BackToTop from '@/components/ui/BackToTop';

// Define the correct params type
type ProjectPageProps = {
  params: {
    slug: string;
  };
};

// Main page component
export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = params;

  const project = await getProjectBySlug(slug);
  if (!project) {
    notFound();
  }

  const relatedProjects = await getRelatedProjects(
    project.id,
    project.category,
    3
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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

// Also update the generateMetadata function
export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = params;
  const project = await getProjectBySlug(slug);
  
  if (!project) {
    return {
      title: 'Project Not Found',
      description: 'The requested project could not be found.',
    };
  }

  return {
    title: `${project.title} | Rishi's Portfolio`,
    description: project.description,
    openGraph: {
      title: `${project.title} | Rishi's Portfolio`,
      description: project.description,
      url: `https://rishiahuja.dev/projects/${project.slug}`,
      siteName: 'Rishi Ahuja',
      images: [
        {
          url: project.image_url || 'https://rishiahuja.dev/og-image.jpg',
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
      type: 'website',
    },
  };
}

// Keep the generateStaticParams function as is
export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}