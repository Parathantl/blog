import React from "react";
import PostCard from "./PostCard";

interface PostType {
    id: number,
    title: string,
    body: string
}

const getPosts = async () => {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts");
    console.log(res);
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