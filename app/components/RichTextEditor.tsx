import React, { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import BlotFormatter from '@enzedonline/quill-blot-formatter2';
import '@enzedonline/quill-blot-formatter2/dist/css/quill-blot-formatter2.css';
import { API_BASE_URL } from '../lib/config';

// Register the blot formatter module
Quill.register('modules/blotFormatter', BlotFormatter);

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
            // Move cursor to next position after image
            quillInstanceRef.current?.setSelection(range.index + 1, 0);
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
          blotFormatter: {},
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
      <style jsx global>{`
        /* Make images in editor responsive */
        .ql-editor img {
          max-width: 100% !important;
          height: auto !important;
        }

        /* Enhance blot formatter toolbar visibility and UX */
        .blot-formatter__toolbar {
          z-index: 1000 !important;
          background: white !important;
          border: 1px solid #ccc !important;
          border-radius: 4px !important;
          padding: 4px !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15) !important;
        }

        .blot-formatter__toolbar-button {
          cursor: pointer !important;
          padding: 4px 8px !important;
          border: none !important;
          background: transparent !important;
        }

        .blot-formatter__toolbar-button:hover {
          background: #f0f0f0 !important;
        }

        .blot-formatter__overlay {
          z-index: 999 !important;
        }
      `}</style>
      <div ref={quillRef} style={{ height: '600px' }}></div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        💡 Tip: Click on an image to see resize handles and alignment toolbar above it. Drag corners to resize, click toolbar buttons to align. Supports JPG, PNG, GIF, WebP (max 5MB).
      </p>
    </div>
  );
};

export default RichTextEditor;
