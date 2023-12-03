import { ChangeEvent } from 'react';

type FileUploaderProps = {
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  multiple?: boolean;
  className?: string;
};

const FileUploader = ({ handleFileChange, multiple = false, className = '' }: FileUploaderProps) => {
  return (
    <div className={className}>
      <input type="file" onChange={handleFileChange} accept="image/*" multiple={multiple} />
    </div>
  );
};

export default FileUploader;
