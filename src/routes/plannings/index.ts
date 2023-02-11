import { Router } from 'express';
import goalRouter from './goal';
import stateRouter from './state';
import stageRouter from './stage';
import perspectiveRouter from './perspective';
import unitRouter from './unit';
import mappRouter from './mapp';
import fontRouter from './font';
import initiativeRouter from './initiative';
import pendingInitiativeRouter from './pendingInitiative';
import activityRouter from './activity';
import pendingActivitiesRouter from './pendingActivity';

const router = Router();

router.use('/goals', goalRouter);
router.use('/states', stateRouter);
router.use('/stages', stageRouter);
router.use('/perspectives', perspectiveRouter);
router.use('/units', unitRouter);
router.use('/mapps', mappRouter);
router.use('/fonts', fontRouter);
router.use('/initiatives', initiativeRouter);
router.use('/pending-initiatives', pendingInitiativeRouter);
router.use('/activities', activityRouter);
router.use('/pending-activities', pendingActivitiesRouter);

export default router;
