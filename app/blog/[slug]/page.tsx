import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { blogAPI } from '@/app/lib/api';
import { MasterCategory, Post } from '@/app/types/blog';
import MasterCategoryPage from '@/app/components/blog/MasterCategoryPage';
import SingleBlogPost from '@/app/components/blog/SingleBlogPost';

// Define the params interface
interface PageParams {
  params: {
    slug: string;
  };
}

// Helper to fetch data (Category or Post)
async function getPageData(slug: string): Promise<{
  type: 'category' | 'post' | null;
  data: MasterCategory | Post | null;
}> {
  try {
    // 1. Try to fetch as Master Category
    const category = await blogAPI.getMasterCategoryBySlug(slug);
    if (category && category.isActive) {
      return { type: 'category', data: category };
    }
  } catch (error) {
    // Ignore error and try next
  }

  try {
    // 2. Try to fetch as Blog Post
    const post = await blogAPI.getPostBySlug(slug);
    if (post) {
      return { type: 'post', data: post };
    }
  } catch (error) {
    // Ignore error
  }

  return { type: null, data: null };
}

// Generate Metadata for SEO
export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { type, data } = await getPageData(params.slug);

  if (!type || !data) {
    return {
      title: 'Page Not Found',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://parathan.com';
  const url = `${siteUrl}/blog/${params.slug}`;

  if (type === 'category') {
    const category = data as MasterCategory;
    return {
      title: `${category.name} Blog | Parathan's Blog`,
      description: category.description || `Read articles about ${category.name} by Parathan Thiyagalingam.`,
      openGraph: {
        title: `${category.name} Blog | Parathan's Blog`,
        description: category.description || `Read articles about ${category.name}.`,
        url,
        type: 'website',
      },
    };
  }

  if (type === 'post') {
    const post = data as Post;
    // Strip HTML from content for description
    const textContent = post.content?.replace(/<[^>]*>/g, '') || '';
    const description = post.excerpt || textContent.substring(0, 160) + '...';
    
    return {
      title: post.title,
      description: description,
      authors: [{ name: post.user ? `${post.user.firstname} ${post.user.lastname}` : 'Parathan Thiyagalingam' }],
      openGraph: {
        title: post.title,
        description: description,
        url,
        type: 'article',
        publishedTime: post.createdAt?.toString(),
        modifiedTime: post.updatedAt?.toString(),
        images: post.mainImageUrl ? [post.mainImageUrl] : [],
        authors: [post.user ? `${post.user.firstname} ${post.user.lastname}` : 'Parathan Thiyagalingam'],
        tags: post.categories?.map(c => c.title),
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: description,
        images: post.mainImageUrl ? [post.mainImageUrl] : [],
      },
    };
  }

  return {};
}

// Main Page Component
export default async function DynamicBlogPage({ params }: PageParams) {
  const { type, data } = await getPageData(params.slug);

  if (!type || !data) {
    notFound();
  }

  // AEO/GEO: Prepare JSON-LD Structured Data
  let jsonLd: any = null;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://parathan.com';

  if (type === 'post') {
    const post = data as Post;
    const textContent = post.content?.replace(/<[^>]*>/g, '') || '';
    const description = post.excerpt || textContent.substring(0, 160) + '...';

    // Smart Type Detection
    const isHowTo = post.title.toLowerCase().startsWith('how to');
    const isFAQ = post.title.toLowerCase().includes('faq') || 
                  post.categories?.some(c => c.title.toLowerCase().includes('faq')) ||
                  post.content.includes('Frequently Asked Questions');

    // Base Schema
    jsonLd = {
      '@context': 'https://schema.org',
      '@type': isHowTo ? 'TechArticle' : 'BlogPosting', // Use TechArticle for guides (Safe "HowTo" alternative without strict steps)
      headline: post.title,
      description: description,
      image: post.mainImageUrl ? [post.mainImageUrl] : [],
      datePublished: post.createdAt,
      dateModified: post.updatedAt || post.createdAt,
      author: {
        '@type': 'Person',
        name: post.user ? `${post.user.firstname} ${post.user.lastname}` : 'Parathan Thiyagalingam',
        url: `${siteUrl}/portfolio/about`,
      },
      publisher: {
        '@type': 'Organization',
        name: 'Parathan Thiyagalingam',
        logo: {
          '@type': 'ImageObject',
          url: `${siteUrl}/logo.png`,
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${siteUrl}/blog/${params.slug}`,
      },
    };

    // If it's a "How To", we add proficiency level to help GEOs
    if (isHowTo) {
      jsonLd.proficiencyLevel = "Beginner";
    }

    // If it's an FAQ, we explicitly explicitly mark it as FAQPage (Mixed Type)
    // Note: Valid FAQPage requires mainEntity array of Questions. 
    // Without parsing the HTML for questions, simply tagging it FAQPage can trigger warnings.
    // We will stick to 'genre': 'FAQ' to be safe from penalties while signalling intent.
    if (isFAQ) {
      jsonLd.genre = 'FAQ';
      jsonLd.alternativeHeadline = 'Frequently Asked Questions';
    }

  } else if (type === 'category') {
    const category = data as MasterCategory;
    jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `${category.name} Blog`,
      description: category.description,
      url: `${siteUrl}/blog/${params.slug}`,
    };
  }

  return (
    <>
      {/* JSON-LD for AEO/GEO */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      {/* Render Component based on type */}
      {type === 'category' ? (
        <MasterCategoryPage masterCategory={data as MasterCategory} />
      ) : (
        <SingleBlogPost slug={params.slug} post={data as Post} />
      )}
    </>
  );
}
