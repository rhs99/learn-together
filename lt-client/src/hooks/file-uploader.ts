import { useState, ChangeEvent, useContext } from 'react';
import axios from 'axios';
import Util from '../utils';
import AuthContext from '../store/auth';

const useFileUploader = () => {
  const [files, setFiles] = useState<FileList | null>(null);
  const authCtx = useContext(AuthContext);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(e.target.files);
    }
  };

  const uploadFile = async (file: File) => {
    const url = `${Util.CONSTANTS.SERVER_URL}/upload/presigned-url`;
    const fileData = { fileName: file.name };

    const { data } = await axios.post(url, fileData, {
      headers: {
        Authorization: `Bearer ${authCtx.getStoredValue().token}`,
      },
    });

    await axios({
      method: 'PUT',
      url: data.uploadUrl,
      data: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    return data.key;
  };

  const handleUpload = async () => {
    if (!files || files.length === 0) {
      return [];
    }
    const uploadPromise = [uploadFile(files[0])];
    if (files.length > 1) {
      uploadPromise.push(uploadFile(files[1]));
    }
    const uploadedFiles = await Promise.all(uploadPromise);
    return uploadedFiles;
  };

  return { handleFileChange, handleUpload };
};

export default useFileUploader;
