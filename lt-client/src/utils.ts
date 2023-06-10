import * as minio from 'minio';
import imageCompression from 'browser-image-compression';
import { PassThrough } from 'stream';

const minioClient = new minio.Client({
  endPoint: 'localhost',
  port: 9000,
  useSSL: false,
  accessKey: '',
  secretKey: '',
});

const uploadFile = async (file: any, cb: any) => {
  const options = {
    maxSizeMB: 0.1,
    maxWidthOrHeight: 600,
    useWebWorker: typeof Worker !== 'undefined',
  };

  try {
    const compressedFile = await imageCompression(file, options);
    const metadata = {
      'Content-type': 'image',
    };

    const reader = new FileReader();
    reader.onload = function (e: any) {
      const buffer = e.target.result;
      const stream = new PassThrough();
      stream.end(Buffer.from(buffer));

      const uniqueFileName = '-' + file.name;

      minioClient.putObject(
        Util.CONSTANTS.MINIO_BUCKET,
        uniqueFileName,
        stream,
        file.size,
        metadata,
        function (err: any) {
          if (err) {
            return console.log(err);
          }
          cb(uniqueFileName);
        }
      );
    };
    reader.readAsArrayBuffer(compressedFile);
  } catch (error) {
    console.log(error);
  }
};

const Util = {
  CONSTANTS: {
    SERVER_URL: 'http://localhost:5000',
    CLIENT_URL: 'http://localhost:3000',
    MINIO_BUCKET: 'lt-bucket',
  },
  minioClient,
  uploadFile,
};

export default Util;
