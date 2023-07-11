import { Router } from 'express';
import { register } from './register';

export const rolesRouter = Router();

rolesRouter.post('/', register);
