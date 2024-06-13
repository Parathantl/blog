import React, { Suspense } from 'react';
const PostsList = React.lazy(() => import('./components/PostsList'));

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-6 flex flex-wrap">
      <div className="w-full md:w-4/5">
        <div className="mb-4">
          <h2 className="text-2xl font-bold mb-2">Blog Posts</h2>
          <p>This is where blog posts will appear. Each post can be displayed here with a preview and a link to read more.</p>
            <Suspense fallback={<div>Loading...</div>}>
              <PostsList />
            </Suspense>
        </div>
      </div>
      <div className="w-full md:w-1/5">
        <aside className="bg-gray-100 p-4">
          <h3 className="font-bold text-xl mb-2">Sidebar</h3>
          <ul className="space-y-2">
            <li>Link 1</li>
            <li>Link 2</li>
            <li>Link 3</li>
            {/* Add more sidebar links or widgets as needed */}
          </ul>
        </aside>
      </div>
    </div>
  );
};

export default Home;
