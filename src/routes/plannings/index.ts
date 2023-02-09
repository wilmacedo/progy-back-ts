import { Router } from 'express';
import goalRouter from './goal';
import stateRouter from './state';
import stageRouter from './stage';

const router = Router();

router.use('/goals', goalRouter);
router.use('/states', stateRouter);
router.use('/stages', stageRouter);

export default router;
