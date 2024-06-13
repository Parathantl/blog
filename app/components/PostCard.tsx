import React from "react";

interface PostCardProps {
    post: {
        id: number,
        title: string,
        body: string,
    }
}

const PostCard: React.FC<PostCardProps> = ({post}) => {
    return (
        <article className="bg-white p-4 shadow rounded">
            <h3 className="font-semibold text-lg">{post.title}</h3>
            <p>{post.body}</p>
        </article>
    )
}

export default PostCard;