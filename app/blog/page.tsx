import { Metadata } from 'next';
import BlogList from '../components/blog/BlogList';
import { getBreadcrumbSchema, SITE_URL } from '../lib/structured-data';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Articles, tutorials, and insights across all topics.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Blog',
    description: 'Articles, tutorials, and insights across all topics.',
    url: `${SITE_URL}/blog`,
    type: 'website',
  },
};

export default function BlogPage() {
  const breadcrumb = getBreadcrumbSchema([
    { name: 'Home', url: SITE_URL },
    { name: 'Blog', url: `${SITE_URL}/blog` },
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
              Blog
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Articles, tutorials, and insights
            </p>
          </div>

          <BlogList />
        </div>
      </div>
    </>
  );
}
