'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { toast } from 'react-toastify';
import ImageUpload from '../../../../components/ImageUpload';
import { blogAPI } from '@/app/lib/api';
import { Category, MasterCategory, Post } from '@/app/types/blog';

const RichTextEditor = dynamic(() => import('../../../../components/RichTextEditor'), { ssr: false });

const EditPost: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryIds, setCategoryIds] = useState<number[]>([]);
  const [selectedMasterCategoryId, setSelectedMasterCategoryId] = useState<number>(0);
  const [mainImageUrl, setMainImageUrl] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [masterCategories, setMasterCategories] = useState<MasterCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [slug, setSlug] = useState('');

  useEffect(() => {
    fetchMasterCategories();
    fetchCategories();
    fetchPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  const fetchMasterCategories = async () => {
    try {
      const data = await blogAPI.getMasterCategories();
      setMasterCategories(data);
    } catch (error) {
      console.error('Error fetching master categories:', error);
      toast.error('Failed to load master categories');
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await blogAPI.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    }
  };

  const fetchPost = async () => {
    try {
      const data: Post = await blogAPI.getPostById(parseInt(postId));
      setTitle(data.title);
      setContent(data.content);
      setMainImageUrl(data.mainImageUrl || '');
      setSlug(data.slug);

      // Set category IDs from the post's categories
      if (data.categories && data.categories.length > 0) {
        const ids = data.categories.map(cat => cat.id);
        setCategoryIds(ids);

        // Set master category from the first category
        const masterCatId = data.categories[0].masterCategoryId;
        setSelectedMasterCategoryId(masterCatId);
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      toast.error('Failed to load post');
      router.push('/admin/posts');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryToggle = (categoryId: number) => {
    setCategoryIds(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
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

    if (categoryIds.length === 0) {
      toast.error('Please select at least one category');
      return;
    }

    setSaving(true);

    try {
      await blogAPI.updatePost(slug, {
        title,
        content,
        mainImageUrl: mainImageUrl || undefined,
        categoryIds,
      });

      toast.success('Post updated successfully!');
      router.push('/admin/posts');
    } catch (error: any) {
      console.error('Error updating post:', error);
      toast.error(error?.response?.data?.message || 'Failed to update post');
    } finally {
      setSaving(false);
    }
  };

  // Filter categories by selected master category
  const filteredCategories = categories.filter(
    cat => cat.masterCategoryId === selectedMasterCategoryId
  );

  if (loading) {
    return (
      <div className="max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Edit Post
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Update your blog post
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

          {/* Master Category Selection */}
          <div>
            <label htmlFor="masterCategory" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Blog Type *
            </label>
            <select
              id="masterCategory"
              value={selectedMasterCategoryId}
              onChange={(e) => {
                setSelectedMasterCategoryId(parseInt(e.target.value));
                setCategoryIds([]); // Reset selected categories when changing master category
              }}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              {masterCategories.map((mc) => (
                <option key={mc.id} value={mc.id}>
                  {mc.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Select which blog this post belongs to (Tech, Tamil, etc.)
            </p>
          </div>

          {/* Categories - Multi-select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Categories * (Select one or more)
            </label>
            <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 max-h-60 overflow-y-auto">
              {filteredCategories.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  No categories available for this blog type. Please create categories first.
                </p>
              ) : (
                <div className="space-y-2">
                  {filteredCategories.map((category) => (
                    <label
                      key={category.id}
                      className="flex items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={categoryIds.includes(category.id)}
                        onChange={() => handleCategoryToggle(category.id)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-3 text-gray-900 dark:text-white">
                        {category.title}
                      </span>
                      {category.description && (
                        <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                          - {category.description}
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              )}
            </div>
            {categoryIds.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-xs text-gray-600 dark:text-gray-400">Selected:</span>
                {categoryIds.map(id => {
                  const cat = categories.find(c => c.id === id);
                  return cat ? (
                    <span
                      key={id}
                      className="px-3 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                    >
                      {cat.title}
                    </span>
                  ) : null;
                })}
              </div>
            )}
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
              <RichTextEditor value={content} onChange={setContent} />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Update your blog post content using the rich text editor
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Update Post'}
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

export default EditPost;
