import { useEffect, useRef } from 'react';
import Quill from 'quill';
import katex from 'katex';
import 'katex/dist/katex.min.css';
window.katex = katex;

import './snow.css';

const toolbarOptions = [
  [{ size: ['small', false, 'large', 'huge'] }],
  ['bold', 'italic', 'underline'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ script: 'sub' }, { script: 'super' }],
  [{ align: [] }],
  ['formula'],
];

type QuillTextEditorProps = {
  onEditorReady: (editor: Quill) => void;
  readOnly?: boolean;
  showToolbar?: boolean;
};

const QuillTextEditor = ({ onEditorReady, readOnly = false, showToolbar = true }: QuillTextEditorProps) => {
  const editorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (editorRef.current) {
      const quill = new Quill(editorRef.current, {
        modules: {
          toolbar: showToolbar ? toolbarOptions : false,
        },
        readOnly: readOnly,
        theme: 'snow',
      });

      onEditorReady(quill);
    }
  }, [onEditorReady]);

  return <div ref={editorRef} style={readOnly ? {} : {height: '150px'}} />;
};

export default QuillTextEditor;
