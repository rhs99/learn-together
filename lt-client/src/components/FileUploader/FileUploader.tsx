import axios from 'axios';
import { useState, useContext, ChangeEvent } from 'react';
import Button from '../../design-library/Button/Button';
import Util from '../../utils';
import AuthContext from '../../store/auth';

type FileUploaderProps = {
  onUploadComplete: (values: string[]) => void;
  multiple?: boolean;
  className?: string;
};

const FileUploader = ({ onUploadComplete, multiple = false, className = '' }: FileUploaderProps) => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const authCtx = useContext(AuthContext);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(e.target.files);
    }
  };

  const uploadFile = async (file: File) => {
    const url = `${Util.CONSTANTS.SERVER_URL}/upload`;
    const formData = new FormData();
    formData.append('files', file);
    const { data } = await axios.post(url, formData, {
      headers: {
        Authorization: `Bearer ${authCtx.getStoredValue().token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return data.fileName;
  };

  const handleUpload = async () => {
    if (!files || files.length === 0) {
      return;
    }
    setIsUploading(true);

    const uploadPromise = [uploadFile(files[0])];
    if (multiple && files.length > 1) {
      uploadPromise.push(uploadFile(files[1]));
    }
    const uploadedFiles = await Promise.all(uploadPromise);
    onUploadComplete(uploadedFiles);

    setIsUploading(false);
  };

  return (
    <div className={className}>
      {isUploading && <p>Loading...</p>}
      <input type="file" onChange={handleFileChange} accept="image/*" multiple={multiple} />
      <Button onClick={handleUpload} variant="secondary">
        Upload
      </Button>
    </div>
  );
};

export default FileUploader;
