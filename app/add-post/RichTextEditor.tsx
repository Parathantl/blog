// components/RichTextEditor.tsx
import React, { useState, FC } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { Delta } from 'quill/core';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  isTitle: boolean;
}

const RichTextEditor: FC<RichTextEditorProps> = ({ value, onChange, isTitle }) => {
  const [editorValue, setEditorValue] = useState<string>(value);

  const handleChange = (content: string, delta: Delta, source: string, editor: any) => {
    setEditorValue(content);
    onChange(content);
  };

  const modules = isTitle
    ? {}
    : {
        toolbar: {
          container: [
            [{ header: '1' }, { header: '2' }, { font: [] }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            ['link', 'image'],
            [{ align: [] }],
            ['clean'],
          ],
        },
        clipboard: {
          matchVisual: false,
        },
      };

  const formats = isTitle
    ? []
    : [
        'header',
        'font',
        'list',
        'bullet',
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'link',
        'image',
        'align',
      ];

  return (
      <ReactQuill
        value={editorValue}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        theme="snow" className="h-50 border border-gray-300 rounded-lg" />
  );
};

export default RichTextEditor;
