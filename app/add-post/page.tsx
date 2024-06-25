"use client"
import React, { useState } from 'react';
import RichTextEditor from './RichTextEditor';
import axios from 'axios';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:3001/post', {
        title,
        content,
        mainImageUrl: 'Hello worldd',
        categoryId: 1
      }, {
        withCredentials: true,
      });
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return ( 
    <><div className="mb-4">
      <label htmlFor="title" className="block text-lg font-medium text-gray-700 mb-2">
        Title
      </label>
      <input
        type="text"
        id="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
    </div><div className="mb-4">
        <label htmlFor="content" className="block text-lg font-medium text-gray-700 mb-2">
          Content
        </label>
        <RichTextEditor value={content} onChange={setContent} isTitle={false} />
      </div><button type="submit" onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700">
        Submit
      </button></>
  );
};

export default CreatePost;