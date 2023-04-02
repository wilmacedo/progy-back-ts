import cors from 'cors';
import { config } from 'dotenv';
import express from 'express';
import http from 'http';
import morgan from 'morgan';
import { router } from './routes';
import { normalizePort, onError } from './utils/server';
import views from './views';

config();

const app = express();

app.use(cors());
app.use(views);
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
