import { Router } from 'express';
import goalRouter from './goal';
import stateRouter from './state';
import stageRouter from './stage';
import perspectiveRouter from './perspective';
import unitRouter from './unit';
import mappRouter from './mapp';
import fontRouter from './font';
import initiativeRouter from './initiative';
import activityRouter from './activity';
import dashboardRouter from './dashboard';
import sheetRouter from './sheet';
import reportRouter from './report';

const router = Router();

router.use('/goals', goalRouter);
router.use('/states', stateRouter);
router.use('/stages', stageRouter);
router.use('/perspectives', perspectiveRouter);
router.use('/units', unitRouter);
router.use('/mapps', mappRouter);
router.use('/fonts', fontRouter);
router.use('/initiatives', initiativeRouter);
router.use('/activities', activityRouter);
router.use('/dashboard', dashboardRouter);
router.use('/sheet', sheetRouter);
router.use('/report', reportRouter);

export default router;
