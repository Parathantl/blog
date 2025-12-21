'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { blogAPI } from '@/app/lib/api';

interface Post {
  id: number;
  title: string;
  content: string;
  slug: string;
  excerpt?: string;
  imageUrl?: string;
  category: {
    id: number;
    name: string;
    type: string;
  };
  user: {
    id: number;
    username: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function PostsManagement() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'tamil' | 'technical'>('all');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const data = await blogAPI.getPosts();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      await fetch(`http://localhost:3001/posts/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      toast.success('Post deleted successfully');
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getCategoryBadgeColor = (type: string) => {
    const colors: Record<string, string> = {
      'tamil-blog': 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200',
      'technical-blog': 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
      'blog': 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const filteredPosts = posts.filter((post) => {
    if (filter === 'tamil') return post.category.type === 'tamil-blog';
    if (filter === 'technical') return post.category.type === 'technical-blog';
    return true;
  });

  const tamilCount = posts.filter(p => p.category.type === 'tamil-blog').length;
  const technicalCount = posts.filter(p => p.category.type === 'technical-blog').length;

  return (
    <div className="max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Blog Posts
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage all your blog posts across Tamil and Technical categories
          </p>
        </div>
        <Link
          href="/admin/posts/add"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors text-center sm:self-start"
        >
          + Write Post
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-4 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          All Posts ({posts.length})
        </button>
        <button
          onClick={() => setFilter('tamil')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            filter === 'tamil'
              ? 'bg-orange-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Tamil Blog ({tamilCount})
        </button>
        <button
          onClick={() => setFilter('technical')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            filter === 'technical'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Technical Blog ({technicalCount})
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 animate-pulse">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-64"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            </div>
          ))}
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {filter === 'tamil' ? 'No Tamil posts yet.' :
             filter === 'technical' ? 'No Technical posts yet.' :
             'No posts yet. Write your first post to get started!'}
          </p>
          <Link
            href="/admin/posts/add"
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
          >
            Write Post
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPosts
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map((post) => (
              <div
                key={post.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Post Image */}
                  {post.imageUrl && (
                    <div className="flex-shrink-0">
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full md:w-48 h-48 md:h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}

                  {/* Post Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {post.title}
                          </h3>
                          <span className={`px-3 py-1 text-xs rounded-full self-start ${getCategoryBadgeColor(post.category.type)}`}>
                            {post.category.name}
                          </span>
                        </div>
                        {post.excerpt && (
                          <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                            {post.excerpt}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <span>By {post.user.username}</span>
                          <span>•</span>
                          <span>{formatDate(post.createdAt)}</span>
                          {post.createdAt !== post.updatedAt && (
                            <>
                              <span>•</span>
                              <span>Updated {formatDate(post.updatedAt)}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors text-center"
                      >
                        View
                      </Link>
                      <Link
                        href={`/admin/posts/${post.id}/edit`}
                        className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors text-center"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
