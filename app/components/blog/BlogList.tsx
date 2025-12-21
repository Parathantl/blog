'use client';

import { useEffect, useState } from 'react';
import BlogCard from './BlogCard';
import { blogAPI } from '@/app/lib/api';

interface Post {
  id: number;
  title: string;
  content: string;
  slug: string;
  createdOn: string;
  mainImageUrl?: string;
  user?: {
    firstname: string;
    lastname: string;
    profilePic?: string;
  };
  category?: {
    id: number;
    title: string;
    type?: string;
  };
}

interface BlogListProps {
  categoryType?: string; // 'tamil-blog', 'technical-blog', or undefined for all
  limit?: number;
}

export default function BlogList({ categoryType, limit }: BlogListProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch posts
        const postsData = await blogAPI.getPosts({ date: 'desc' });

        // Fetch categories
        const categoriesData = await blogAPI.getCategories();
        setCategories(categoriesData);

        // Filter by category type if specified
        let filteredData = postsData;
        if (categoryType) {
          filteredData = postsData.filter(
            (post: Post) => post.category?.type === categoryType
          );
        }

        // Apply limit if specified
        const postsToShow = limit ? filteredData.slice(0, limit) : filteredData;

        setPosts(postsToShow);
        setFilteredPosts(postsToShow);
      } catch (err) {
        setError('Failed to load blog posts');
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryType, limit]);

  // Handle search and category filter
  useEffect(() => {
    let filtered = posts;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter((post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(
        (post) => post.category?.id === parseInt(selectedCategory)
      );
    }

    setFilteredPosts(filtered);
  }, [searchQuery, selectedCategory, posts]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-gray-200 dark:bg-gray-700 rounded-lg h-96 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Search and Filter Controls */}
      {!categoryType && (
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          {/* Search */}
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.title}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Posts Grid */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            {searchQuery || selectedCategory !== 'all'
              ? 'No posts found matching your criteria.'
              : 'No blog posts available yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {/* Results Count */}
      {(searchQuery || selectedCategory !== 'all') && filteredPosts.length > 0 && (
        <div className="text-center mt-8 text-gray-600 dark:text-gray-400">
          Showing {filteredPosts.length} of {posts.length} posts
        </div>
      )}
    </div>
  );
}
