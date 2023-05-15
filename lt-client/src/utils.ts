import * as minio from 'minio';

const minioClient = new minio.Client({
  endPoint: 'localhost',
  port: 9000,
  useSSL: false,
  accessKey: '',
  secretKey: '',
});

const Util = {
  CONSTANTS: {
    SERVER_URL: 'http://localhost:5000',
    MINIO_BUCKET: 'lt-bucket',
  },
  minioClient,
};

export default Util;
