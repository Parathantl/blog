'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import DOMPurify from 'dompurify';
import { blogAPI } from '@/app/lib/api';
import { Post } from '@/app/types/blog';

export default function SingleBlogPost() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<Post | null>(null);
  const [sanitizedContent, setSanitizedContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const data = await blogAPI.getPostBySlug(slug);
        setPost(data);

        // Sanitize content
        const clean = DOMPurify.sanitize(data.content);
        setSanitizedContent(clean);
      } catch (err) {
        setError('Failed to load blog post');
        console.error('Error fetching post:', err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  // Add click handlers to images for lightbox
  useEffect(() => {
    const handleImageClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG' && target.closest('.prose')) {
        const img = target as HTMLImageElement;
        setLightboxImage(img.src);
      }
    };

    document.addEventListener('click', handleImageClick);
    return () => document.removeEventListener('click', handleImageClick);
  }, []);

  // Handle ESC key to close lightbox
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxImage(null);
      }
    };

    if (lightboxImage) {
      document.addEventListener('keydown', handleEsc);
      // Prevent body scroll when lightbox is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [lightboxImage]);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Calculate read time
  const calculateReadTime = (content: string) => {
    const text = content.replace(/<[^>]*>/g, '');
    const wordCount = text.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / 200);
    return `${minutes} min read`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">
            {error || 'Post not found'}
          </p>
          <Link
            href="/blog"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-6 md:py-12">
      <style jsx>{`
        /* Fix Quill editor inline styles for responsive images */
        .blog-content img {
          max-width: 100% !important;
          height: auto !important;
          cursor: pointer !important;
          display: block;
          margin-left: auto;
          margin-right: auto;
        }

        /* Remove width attribute effect on mobile */
        @media (max-width: 768px) {
          .blog-content img {
            width: 100% !important;
          }
        }
      `}</style>

      <article className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Back Link */}
          <Link
            href="/blog"
            className="inline-block text-blue-600 dark:text-blue-400 hover:underline mb-4 md:mb-6 text-sm md:text-base"
          >
            ← Back to Blog
          </Link>

          {/* Article Header */}
          <header className="mb-6 md:mb-8">
            {/* Category Badges */}
            {post.categories && post.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.categories.map((category) => {
                  const masterCategorySlug = category.masterCategory?.slug || 'blog';
                  const blogPath = `/blog/${masterCategorySlug}`;

                  return (
                    <Link
                      key={category.id}
                      href={blogPath}
                      className="inline-block px-3 py-1.5 md:px-4 md:py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm md:text-base font-semibold hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                    >
                      {category.title}
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Title */}
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
              {post.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-3 md:gap-6 text-sm md:text-base text-gray-600 dark:text-gray-400 mb-6">
              {/* Author */}
              <div className="flex items-center gap-2">
                {post.user?.profilePic ? (
                  <img
                    src={post.user.profilePic}
                    alt={`${post.user.firstname} ${post.user.lastname}`}
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                    {post.user?.firstname?.charAt(0) || 'A'}
                  </div>
                )}
                <span className="font-medium">
                  {post.user?.firstname} {post.user?.lastname}
                </span>
              </div>

              <span className="hidden sm:inline">•</span>
              <span className="text-xs md:text-sm">{formatDate(post.createdAt || post.createdOn || '')}</span>
              <span className="hidden sm:inline">•</span>
              <span className="text-xs md:text-sm">{calculateReadTime(post.content)}</span>
            </div>

            {/* Featured Image */}
            {post.mainImageUrl && (
              <img
                src={post.mainImageUrl}
                alt={post.title}
                className="w-full h-48 md:h-96 object-cover rounded-lg shadow-lg"
              />
            )}
          </header>

          {/* Article Content */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 md:p-8 lg:p-12">
            <div
              className="blog-content prose dark:prose-invert max-w-none prose-sm md:prose-lg
                prose-headings:text-gray-900 dark:prose-headings:text-white
                prose-p:text-gray-700 dark:prose-p:text-gray-300
                prose-a:text-blue-600 dark:prose-a:text-blue-400
                prose-strong:text-gray-900 dark:prose-strong:text-white
                prose-code:text-gray-900 dark:prose-code:text-white
                prose-pre:bg-gray-100 dark:prose-pre:bg-gray-900
                prose-img:rounded-lg prose-img:shadow-md prose-img:transition-transform prose-img:hover:scale-[1.02]
                prose-headings:leading-tight prose-p:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />
          </div>

          {/* Footer */}
          <div className="mt-8 md:mt-12 text-center">
            <Link
              href="/blog"
              className="inline-block px-6 py-2.5 md:px-8 md:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors text-sm md:text-base"
            >
              View More Posts
            </Link>
          </div>
        </div>
      </article>

      {/* Image Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-2 md:p-4 backdrop-blur-sm"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-w-7xl max-h-full w-full">
            {/* Close Button */}
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute -top-10 md:-top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
              aria-label="Close"
            >
              <svg
                className="w-8 h-8 md:w-10 md:h-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Image */}
            <img
              src={lightboxImage}
              alt="Enlarged view"
              className="max-w-full max-h-[85vh] md:max-h-[90vh] w-auto h-auto object-contain rounded-lg shadow-2xl mx-auto"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Hint Text */}
            <p className="text-center text-white text-xs md:text-sm mt-2 md:mt-4 opacity-75">
              Click outside or press ESC to close
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
