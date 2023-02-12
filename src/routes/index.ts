import { Router } from 'express';
import institutionRouter from './institution';
import roleRouter from './role';
import userRouter from './user';
import planningRouter from './planning';
import formRouter from './form';
import pendingActivitiesRouter from './pendingActivity';
import pendingInitiativeRouter from './pendingInitiative';

const router = Router();

router.use('/roles', roleRouter);
router.use('/institution', institutionRouter);
router.use('/users', userRouter);
router.use('/plannings', planningRouter);
router.use('/form', formRouter);
router.use('/pending-activities', pendingActivitiesRouter);
router.use('/pending-initiatives', pendingInitiativeRouter);

export { router };
