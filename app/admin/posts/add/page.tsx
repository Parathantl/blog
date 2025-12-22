'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { toast } from 'react-toastify';
import ImageUpload from '../../../components/ImageUpload';
import { API_BASE_URL } from '@/app/lib/config';

const RichTextEditor = dynamic(() => import('../../../components/RichTextEditor'), { ssr: false });

interface Category {
  id: number;
  title: string;
  type: string;
}

const AddPost: React.FC = () => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState<number>(0);
  const [mainImageUrl, setMainImageUrl] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/category`, {
        withCredentials: true,
      });
      setCategories(response.data);
      // Set default category if available
      if (response.data.length > 0) {
        setCategoryId(response.data[0].id);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    if (!content.trim()) {
      toast.error('Please enter content');
      return;
    }

    if (!categoryId) {
      toast.error('Please select a category');
      return;
    }

    setLoading(true);

    try {
      await axios.post(`${API_BASE_URL}/post`, {
        title,
        content,
        mainImageUrl: mainImageUrl || 'default-image.jpg',
        categoryId,
      }, {
        withCredentials: true,
      });

      toast.success('Post created successfully!');
      router.push('/admin/posts');
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryBadgeColor = (type: string) => {
    const colors: Record<string, string> = {
      'tamil-blog': 'bg-orange-100 text-orange-800',
      'technical-blog': 'bg-blue-100 text-blue-800',
      'blog': 'bg-gray-100 text-gray-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Write New Post
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Create a new blog post for your portfolio
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Post Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter your post title..."
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category *
            </label>
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(parseInt(e.target.value))}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value={0}>Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.title} - {category.type}
                </option>
              ))}
            </select>
            <div className="flex gap-2 mt-2">
              {categories.map((category) => (
                <span
                  key={category.id}
                  className={`px-3 py-1 text-xs rounded-full ${getCategoryBadgeColor(category.type)}`}
                >
                  {category.title}
                </span>
              ))}
            </div>
          </div>

          {/* Featured Image */}
          <ImageUpload
            label="Featured Image"
            value={mainImageUrl}
            onChange={setMainImageUrl}
            folder="posts"
            preview={true}
          />

          {/* Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Content *
            </label>
            <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
              <RichTextEditor onChange={setContent} />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Write your blog post content using the rich text editor
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              {loading ? 'Publishing...' : 'Publish Post'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin/posts')}
              className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddPost;
