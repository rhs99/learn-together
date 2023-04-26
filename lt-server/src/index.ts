import express, { Application, Request, Response } from 'express';
import mongoose, { ConnectOptions } from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';

const app: Application = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', async (req: Request, res: Response): Promise<Response> => {
  return res.status(200).send({
    message: 'Hello World!',
  });
});

const PORT = 5000;

try {
  app.listen(PORT, (): void => {
    console.log(`Connected successfully on port ${PORT}`);
  });
} catch (error) {
  if (error instanceof Error) {
    console.error(`Error occured: ${error.message}`);
  }
}

const DB_URL = 'mongodb://mongo:27017/lt-db';

const connectDB = async () => {
  await mongoose
    .connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions)
    .then(() => console.log('Mongo connected successfully'))
    .catch((e) => {
      console.log(e.message);
    });
};

connectDB();
