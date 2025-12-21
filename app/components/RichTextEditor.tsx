import React, { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize';
import { API_BASE_URL } from '../lib/config';

// Register the image resize module
Quill.register('modules/imageResize', ImageResize);

interface RichTextEditorProps {
  onChange: (content: string) => void;
  value?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ onChange, value }) => {
  const quillRef = useRef<HTMLDivElement>(null);
  const quillInstanceRef = useRef<Quill | null>(null);
  const isInitializedRef = useRef(false);

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE_URL}/post/upload-photo`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Image upload failed');
      }

      const data = await response.json();
      return data.filePath;
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
      return null;
    }
  };

  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/jpeg,image/jpg,image/png,image/gif,image/webp');
    input.click();

    input.onchange = async () => {
      const file = input.files ? input.files[0] : null;
      if (file) {
        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
          alert('File size must be less than 5MB');
          return;
        }

        // Show loading indicator
        const range = quillInstanceRef.current?.getSelection();
        if (range) {
          quillInstanceRef.current?.insertText(range.index, 'Uploading image...');
        }

        const url = await uploadImage(file);

        // Remove loading text
        if (range && quillInstanceRef.current) {
          quillInstanceRef.current?.deleteText(range.index, 'Uploading image...'.length);

          if (url) {
            quillInstanceRef.current?.insertEmbed(range.index, 'image', url);
          }
        }
      }
    };
  };

  // Initialize Quill only once
  useEffect(() => {
    if (quillRef.current && !isInitializedRef.current) {
      quillInstanceRef.current = new Quill(quillRef.current, {
        theme: 'snow',
        modules: {
          toolbar: {
            container: [
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
              [{ 'font': [] }],
              [{ 'size': ['small', false, 'large', 'huge'] }],
              ['bold', 'italic', 'underline', 'strike'],
              [{ 'color': [] }, { 'background': [] }],
              [{ 'script': 'sub' }, { 'script': 'super' }],
              [{ 'list': 'ordered' }, { 'list': 'bullet' }],
              [{ 'indent': '-1' }, { 'indent': '+1' }],
              [{ 'align': [] }],
              ['blockquote', 'code-block'],
              ['link', 'image', 'video'],
              ['clean'],
            ],
            handlers: {
              image: handleImageUpload,
            },
          },
          imageResize: {
            displaySize: true,
          },
        },
      });

      quillInstanceRef.current.on('text-change', () => {
        if (quillInstanceRef.current) {
          onChange(quillInstanceRef.current.root.innerHTML);
        }
      });

      // Set initial value if provided
      if (value) {
        quillInstanceRef.current.root.innerHTML = value;
      }

      isInitializedRef.current = true;
    }
  }, []); // Empty dependency array - initialize only once

  // Update content when value prop changes (for edit mode)
  useEffect(() => {
    if (quillInstanceRef.current && value !== undefined && isInitializedRef.current) {
      const currentContent = quillInstanceRef.current.root.innerHTML;
      if (currentContent !== value) {
        quillInstanceRef.current.root.innerHTML = value;
      }
    }
  }, [value]);

  return (
    <div>
      <div ref={quillRef} style={{ height: '600px' }}></div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        💡 Tip: You can drag corners to resize images after inserting them. Supports JPG, PNG, GIF, WebP (max 5MB).
      </p>
    </div>
  );
};

export default RichTextEditor;
