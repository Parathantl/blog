"use client";
import React, { Suspense } from 'react';
const PostsList = React.lazy(() => import('./components/PostsList'));

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-6 flex flex-wrap">
      <div className="w-full lg:w-3/4 pr-4 lg:pr-8">
        <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">Blog Posts</h2>
      <p className="font-bold mb-2 text-gray-900 dark:text-gray-100">This is where blog posts will appear. Each post can be displayed here with a preview and a link to read more.</p>
          <Suspense fallback={<div>Loading...</div>}>
            <PostsList />
          </Suspense>
        </div>
      </div>
      <div className="w-full lg:w-1/4 mt-6 lg:mt-0">
        <aside className="bg-gray-100 dark:bg-gray-800 p-4">
          <h3 className="font-bold text-xl mb-2">Sidebar</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-blue-500 hover:underline dark:text-blue-400">Link 1</a></li>
            <li><a href="#" className="text-blue-500 hover:underline dark:text-blue-400">Link 2</a></li>
            <li><a href="#" className="text-blue-500 hover:underline dark:text-blue-400">Link 3</a></li>
            {/* Add more sidebar links or widgets as needed */}
          </ul>
        </aside>
      </div>
    </div>
  );
};

export default Home;
