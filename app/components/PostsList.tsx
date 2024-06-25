import React from "react";
import PostCard from "./PostCard";

interface PostType {
    id: number,
    title: string,
    content: string
}

const getPosts = async () => {
    const res = await fetch("http://localhost:3001/post?date=desc");
    if(!res.ok) {
        throw new Error('Invalid API');
    }

    return res.json();
}

const PostsList = async () => {
    const posts = await getPosts();

    return (
        <div className="space-y-4">
            {posts.map((post:PostType) => (
                <div key={post.id}>
                    <PostCard post={post} />
                </div>
            ))} 
        </div>
    )
}

export default PostsList;