import { usersRouter } from '@/http/controllers/users/routes';
import { Router } from 'express';

export const router = Router();

router.use('/users', usersRouter);
