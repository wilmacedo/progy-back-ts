import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { router } from './routes';
import http from 'http';
import { normalizePort, onError } from './utils/server';
import dotenv from 'dotenv';

dotenv.config();
dotenv.config({ path: `${__dirname}/../../.env.test` });

const app = express();

app.use(cors());

app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json({ limit: '50mb' }));
app.use(morgan('dev'));

app.all('*', router);

const server = http.createServer(app);
const port = normalizePort(process.env.PORT || '3333');

server.listen(port);
server.on('error', error => onError(error, port));
server.on('listening', () => {
  console.log('Server is running at', port);
});
