import { usersRouter } from '@/v2/http/controllers/users/routes';
import { Router } from 'express';

export const router = Router();

router.use('/', usersRouter);
