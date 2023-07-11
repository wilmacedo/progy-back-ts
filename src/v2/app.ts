import { errorHandler } from '@/utils/error-handler';
import cors from 'cors';
import express from 'express';
import 'express-async-errors';
import morgan from 'morgan';
import { router } from './routes';

export const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json({ limit: '50mb' }));
app.use(morgan('dev'));

app.use('/v2', router);

app.use(errorHandler);
