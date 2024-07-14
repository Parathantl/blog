import React, { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize';

// Register the image resize module
Quill.register('modules/imageResize', ImageResize);

interface RichTextEditorProps {
  onChange: (content: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ onChange }) => {
  const quillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const uploadImage = async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('http://localhost:3001/post/upload-photo', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Image upload failed');
        }

        const data = await response.json();
        console.log(data);
        return data.filePath; // Assuming the server returns a JSON object with the URL
      } catch (error) {
        console.error('Error uploading image:', error);
        return null;
      }
    };

    let quillInstance: Quill | null = null;

    const handleImageUpload = () => {
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.setAttribute('accept', 'image/*');
      input.click();

      input.onchange = async () => {
        const file = input.files ? input.files[0] : null;
        if (file) {
          const url = await uploadImage(file);
          if (url) {
            const range = quillInstance?.getSelection(); // Add null check for quillInstance
            if (range) {
              quillInstance?.insertEmbed(range.index, 'image', url);
            }
          }
        }
      };
    };

    if (quillRef.current) {
      quillInstance = new Quill(quillRef.current, {
        theme: 'snow',
        modules: {
          toolbar: {
            container: [
              [{ 'header': [1, 2, false] }],
              ['bold', 'italic', 'underline'],
              ['image', 'code-block'],
            ],
            handlers: {
              image: handleImageUpload,
            },
          },
          imageResize: {},
        },
      });

      quillInstance.on('text-change', () => {
        if (quillInstance) {
          onChange(quillInstance.root.innerHTML);
        }
      });
    }

    return () => {
      if (quillInstance) {
        quillInstance = null;
      }
    };
  }, [onChange]);

  return (
    <div>
      <div ref={quillRef} style={{ height: '500px' }}></div>
    </div>
  );
};

export default RichTextEditor;
