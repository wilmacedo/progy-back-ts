import { Router } from 'express';
import { register } from './register';

export const usersRouter = Router();

usersRouter.post('/', register);
