import Link from 'next/link';
import BlogList from '../../components/blog/BlogList';

export default function TamilBlogPage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            தமிழ் Blog
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            தமிழில் எழுதப்பட்ட கட்டுரைகள்
          </p>

          {/* Quick Navigation */}
          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              href="/blog"
              className="px-6 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              All Posts
            </Link>
            <Link
              href="/blog/tech"
              className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Tech Blog
            </Link>
            <Link
              href="/blog/tamil"
              className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              தமிழ் Blog
            </Link>
          </div>
        </div>

        {/* Tamil Blog Posts */}
        <BlogList masterCategorySlug="tamil" />
      </div>
    </div>
  );
}
