import { useEffect, useRef } from 'react';
import Quill from 'quill';

import './_index.scss';

type QuillTextEditorProps = {
  onEditorReady: (editor: any) => void;
};

const QuillTextEditor = ({ onEditorReady }: QuillTextEditorProps) => {
  const editorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (editorRef.current) {
      const quill = new Quill(editorRef.current, {
        theme: 'snow',
      });

      onEditorReady(quill);
    }
  }, [onEditorReady]);

  return <div ref={editorRef} className="cl-Editor" />;
};

export default QuillTextEditor;
