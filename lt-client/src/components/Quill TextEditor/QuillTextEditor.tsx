import { useEffect, useRef } from 'react';
import Quill from 'quill';
import * as katexModule from 'katex';
import 'katex/dist/katex.min.css';

// Create a global declaration to fix TypeScript error
declare global {
  interface Window {
    katex: typeof katexModule;
  }
}

// Assign katex to the window object
window.katex = katexModule;

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
  }, [onEditorReady, readOnly, showToolbar]);

  return <div ref={editorRef} style={readOnly ? {} : { height: '150px' }} />;
};

export default QuillTextEditor;
