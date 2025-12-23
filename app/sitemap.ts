import { MetadataRoute } from 'next';
import { Post } from './types/blog';

// Get the site URL from environment or use a default
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';

// For sitemap generation, we need the full public URL (not relative /api)
// This is used at build time when relative URLs don't work
const API_URL = `${SITE_URL}/api`;

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
    const postsResponse = await fetch(`${API_URL}/post`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (postsResponse.ok) {
      const posts: Post[] = await postsResponse.json();
      blogPosts = posts.map((post) => ({
        url: `${SITE_URL}/blog/${post.slug}`,
        lastModified: post.updatedAt || post.createdAt,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
    } else {
      console.warn('Failed to fetch blog posts for sitemap:', postsResponse.status);
    }
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error);
  }

  // Fetch projects - add to sitemap if successful
  let projectPages: MetadataRoute.Sitemap = [];
  try {
    const projectsResponse = await fetch(`${API_URL}/portfolio/projects`, {
      next: { revalidate: 3600 },
    });

    if (projectsResponse.ok) {
      const projects: Project[] = await projectsResponse.json();
      projectPages = projects.map((project) => ({
        url: `${SITE_URL}/portfolio/projects/${project.id}`,
        lastModified: project.updatedAt || project.createdAt,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }));
    } else {
      console.warn('Failed to fetch projects for sitemap:', projectsResponse.status);
    }
  } catch (error) {
    console.error('Error fetching projects for sitemap:', error);
  }

  return [...staticPages, ...blogPosts, ...projectPages];
}
