'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { blogAPI } from '@/app/lib/api';
import { MasterCategory } from '@/app/types/blog';
import MasterCategoryPage from '@/app/components/blog/MasterCategoryPage';
import SingleBlogPost from '@/app/components/blog/SingleBlogPost';

export default function DynamicBlogPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [pageType, setPageType] = useState<'category' | 'post' | 'not-found' | null>(null);
  const [masterCategory, setMasterCategory] = useState<MasterCategory | null>(null);

  useEffect(() => {
    const determinePage = async () => {
      try {
        // First, try to fetch as a master category
        const category = await blogAPI.getMasterCategoryBySlug(slug);

        if (category && category.isActive) {
          setMasterCategory(category);
          setPageType('category');
          return;
        }
      } catch (error) {
        // Not a master category, continue to check if it's a post
      }

      // If not a master category, assume it's a post
      setPageType('post');
    };

    if (slug) {
      determinePage();
    }
  }, [slug]);

  // Show loading state while determining page type
  if (pageType === null) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  // Render master category page
  if (pageType === 'category' && masterCategory) {
    return <MasterCategoryPage masterCategory={masterCategory} />;
  }

  // Render blog post
  if (pageType === 'post') {
    return <SingleBlogPost slug={slug} />;
  }

  return null;
}
