import { Router } from 'express';
import { institutionRouter } from './institution';
import { roleRouter } from './role';
import { userRouter } from './user';

const router = Router();

router.use('/role', roleRouter);
router.use('/institution', institutionRouter);
router.use('/user', userRouter);

export { router };
