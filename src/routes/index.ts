import { Router } from 'express';
import emailRouter from './email';
import formRouter from './form';
import institutionRouter from './institution';
import pendingActivitiesRouter from './pendingActivity';
import pendingInitiativeRouter from './pendingInitiative';
import planningRouter from './planning';
import roleRouter from './role';
import userRouter from './user';
const router = Router();

router.use('/roles', roleRouter);
router.use('/institution', institutionRouter);
router.use('/users', userRouter);
router.use('/plannings', planningRouter);
router.use('/form', formRouter);
router.use('/pending-activities', pendingActivitiesRouter);
router.use('/pending-initiatives', pendingInitiativeRouter);
router.use('/email', emailRouter);

export { router };
