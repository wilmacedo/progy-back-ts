import { Router } from 'express';
import goalRouter from './goal';
import stateRouter from './state';
import stageRouter from './stage';
import perspectiveRouter from './perspective';

const router = Router();

router.use('/goals', goalRouter);
router.use('/states', stateRouter);
router.use('/stages', stageRouter);
router.use('/perspectives', perspectiveRouter);

export default router;
