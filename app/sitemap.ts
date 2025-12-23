import { MetadataRoute } from 'next';
import { API_BASE_URL } from './lib/config';
import { Post } from './types/blog';

// Get the site URL from environment or use a default
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';

interface Project {
  id: number;
  updatedAt?: string;
  createdAt?: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    // Fetch all blog posts
    const postsResponse = await fetch(`${API_BASE_URL}/post`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });
    const posts: Post[] = postsResponse.ok ? await postsResponse.json() : [];

    // Fetch all projects
    const projectsResponse = await fetch(`${API_BASE_URL}/portfolio/projects`, {
      next: { revalidate: 3600 },
    });
    const projects: Project[] = projectsResponse.ok ? await projectsResponse.json() : [];

    // Generate blog post URLs
    const blogPosts = posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post.updatedAt || post.createdAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    // Generate project URLs
    const projectPages = projects.map((project) => ({
      url: `${SITE_URL}/portfolio/projects/${project.id}`,
      lastModified: project.updatedAt || project.createdAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

    // Static pages
    const staticPages = [
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

    return [...staticPages, ...blogPosts, ...projectPages];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return static pages only if API calls fail
    return [
      {
        url: SITE_URL,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1.0,
      },
    ];
  }
}
