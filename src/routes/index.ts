import { Router } from 'express';
import institutionRouter from './institution';
import roleRouter from './role';
import userRouter from './user';
import planningRouter from './planning';
import formRouter from './form';

const router = Router();

router.use('/role', roleRouter);
router.use('/institution', institutionRouter);
router.use('/user', userRouter);
router.use('/plannings', planningRouter);
router.use('/form', formRouter);

export { router };
