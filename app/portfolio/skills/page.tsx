import { Metadata } from 'next';
import SkillsSection from '../../components/portfolio/SkillsSection';
import { getBreadcrumbSchema, SITE_URL } from '../../lib/structured-data';

export const metadata: Metadata = {
  title: 'Skills & Technologies',
  description: 'Technologies and tools I use to bring ideas to life. Full stack development skills including JavaScript, TypeScript, React, Node.js, and more.',
  alternates: { canonical: '/portfolio/skills' },
  openGraph: {
    title: 'Skills & Technologies',
    description: 'Technologies and tools I use to bring ideas to life.',
    url: `${SITE_URL}/portfolio/skills`,
    type: 'website',
  },
};

export default function SkillsPage() {
  const breadcrumb = getBreadcrumbSchema([
    { name: 'Home', url: SITE_URL },
    { name: 'Portfolio', url: `${SITE_URL}/portfolio` },
    { name: 'Skills', url: `${SITE_URL}/portfolio/skills` },
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
              Skills & Technologies
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Technologies and tools I use to bring ideas to life
            </p>
          </div>

          <SkillsSection />
        </div>
      </div>
    </>
  );
}
