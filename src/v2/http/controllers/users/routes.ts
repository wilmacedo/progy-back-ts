import { Router } from 'express';
import { authenticate } from './authenticate';
import { register } from './register';

export const usersRouter = Router();

usersRouter.post('/', register);
usersRouter.post('/sessions', authenticate);
