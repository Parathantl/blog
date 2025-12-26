import BlogList from '../components/blog/BlogList';

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Tech Blog
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Technical insights and tutorials
          </p>
        </div>

        {/* Blog List */}
        <BlogList masterCategorySlug="tech" />
      </div>
    </div>
  );
}
