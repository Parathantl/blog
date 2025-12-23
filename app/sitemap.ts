import { MetadataRoute } from 'next';
import { Post } from './types/blog';

// Force dynamic generation - sitemap should be generated on request, not at build time
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

// Get the site URL from environment or use a default
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';

// For server-side API calls (sitemap generation):
// - In Docker: Use internal Docker network URL (http://backend:3001)
// - In development: Use localhost
// - Fallback: Use public API endpoint
const getApiUrl = () => {
  // Docker internal network (preferred for server-side calls in production)
  if (process.env.INTERNAL_API_URL) {
    return process.env.INTERNAL_API_URL;
  }

  // Development
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3001';
  }

  // Fallback to public URL
  return `${SITE_URL}/api`;
};

const API_URL = getApiUrl();

interface Project {
  id: number;
  updatedAt?: string;
  createdAt?: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages - always included
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/blog/tech`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/blog/tamil`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/portfolio`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/portfolio/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/portfolio/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/portfolio/skills`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/portfolio/experience`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
  ];

  // Fetch blog posts - add to sitemap if successful
  let blogPosts: MetadataRoute.Sitemap = [];
  try {
    console.log(`[Sitemap] Fetching blog posts from: ${API_URL}/post`);
    const postsResponse = await fetch(`${API_URL}/post`, {
      cache: 'no-store', // Ensure we get fresh data
    });

    if (postsResponse.ok) {
      const posts: Post[] = await postsResponse.json();
      console.log(`[Sitemap] Successfully fetched ${posts.length} blog posts`);
      blogPosts = posts.map((post) => ({
        url: `${SITE_URL}/blog/${post.slug}`,
        lastModified: post.updatedAt || post.createdAt,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
    } else {
      console.warn(`[Sitemap] Failed to fetch blog posts: HTTP ${postsResponse.status}`);
    }
  } catch (error) {
    console.error('[Sitemap] Error fetching blog posts:', error);
  }

  // Fetch projects - add to sitemap if successful
  let projectPages: MetadataRoute.Sitemap = [];
  try {
    console.log(`[Sitemap] Fetching projects from: ${API_URL}/portfolio/projects`);
    const projectsResponse = await fetch(`${API_URL}/portfolio/projects`, {
      cache: 'no-store', // Ensure we get fresh data
    });

    if (projectsResponse.ok) {
      const projects: Project[] = await projectsResponse.json();
      console.log(`[Sitemap] Successfully fetched ${projects.length} projects`);
      projectPages = projects.map((project) => ({
        url: `${SITE_URL}/portfolio/projects/${project.id}`,
        lastModified: project.updatedAt || project.createdAt,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }));
    } else {
      console.warn(`[Sitemap] Failed to fetch projects: HTTP ${projectsResponse.status}`);
    }
  } catch (error) {
    console.error('[Sitemap] Error fetching projects:', error);
  }

  const totalUrls = [...staticPages, ...blogPosts, ...projectPages];
  console.log(`[Sitemap] Generated sitemap with ${totalUrls.length} URLs (${staticPages.length} static, ${blogPosts.length} posts, ${projectPages.length} projects)`);

  return totalUrls;
}
