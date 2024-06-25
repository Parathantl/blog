"use client"

import React, { useEffect, useState } from "react";
import DOMPurify from 'dompurify';
interface PostCardProps {
    post: {
        id: number,
        title: string,
        content: string,
    }
}

const PostCard: React.FC<PostCardProps> = ({post}) => {

    const [sanitizedHtml, setSanitizedHtml] = useState('');
    const [isLoading, setIsLoading] = useState(true); // Loading state
  
    useEffect(() => {
      // Simulating async sanitization process
      const sanitizeContent = async () => {
        const sanitized = DOMPurify.sanitize(post.content);
        setSanitizedHtml(sanitized);
        setIsLoading(false); // Set loading to false after sanitization
      };
  
      // Call the async function
      sanitizeContent();
    }, [post]);

    return (
        <article className="bg-white p-4 shadow rounded">
        <h3 className="font-semibold text-lg">{post.title}</h3>

        {/* Show loading indicator while content is loading */}
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="post-content" dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
        )}
      </article>
    )
}

export default PostCard;