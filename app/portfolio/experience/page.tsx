import { Metadata } from 'next';
import ExperienceTimeline from '../../components/portfolio/ExperienceTimeline';
import { getBreadcrumbSchema, SITE_URL } from '../../lib/structured-data';

export const metadata: Metadata = {
  title: 'Work Experience',
  description: 'My professional journey and career highlights as a Full Stack Developer.',
  alternates: { canonical: '/portfolio/experience' },
  openGraph: {
    title: 'Work Experience',
    description: 'My professional journey and career highlights.',
    url: `${SITE_URL}/portfolio/experience`,
    type: 'website',
  },
};

export default function ExperiencePage() {
  const breadcrumb = getBreadcrumbSchema([
    { name: 'Home', url: SITE_URL },
    { name: 'Portfolio', url: `${SITE_URL}/portfolio` },
    { name: 'Experience', url: `${SITE_URL}/portfolio/experience` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Work Experience
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              My professional journey and career highlights
            </p>
          </div>

          <div className="flex justify-center">
            <ExperienceTimeline />
          </div>
        </div>
      </div>
    </>
  );
}
