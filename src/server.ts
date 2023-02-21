import cors from 'cors';
import { config } from 'dotenv';
import express, { Request, Response } from 'express';
import http from 'http';
import morgan from 'morgan';
import mailQueue from './lib/queue';
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

app.get('/mail', async (_: Request, response: Response) => {
  await mailQueue.add({
    user: { name: 'John Doe', email: 'johndoe@gmail.com' },
  });

  response.json({ ok: true });
});

const server = http.createServer(app);
const port = normalizePort(process.env.PORT || '3333');

server.listen(port);
server.on('error', error => onError(error, port));
server.on('listening', () => {
  console.log('Server is running at', port);
});
