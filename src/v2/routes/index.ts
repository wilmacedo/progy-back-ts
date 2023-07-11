import { rolesRouter } from '@/http/controllers/roles/routes';
import { usersRouter } from '@/http/controllers/users/routes';
import { Router } from 'express';

export const router = Router();

router.use('/users', usersRouter);
router.use('/roles', rolesRouter);
