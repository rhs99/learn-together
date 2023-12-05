import { useEffect, useRef } from 'react';
import Quill from 'quill';
import katex from 'katex';
import 'katex/dist/katex.min.css';
window.katex = katex;

import './_index.scss';

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
};

const QuillTextEditor = ({ onEditorReady }: QuillTextEditorProps) => {
  const editorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (editorRef.current) {
      const quill = new Quill(editorRef.current, {
        modules: {
          toolbar: toolbarOptions,
        },
        theme: 'snow',
      });

      onEditorReady(quill);
    }
  }, [onEditorReady]);

  return <div ref={editorRef} className="cl-Editor" />;
};

export default QuillTextEditor;
