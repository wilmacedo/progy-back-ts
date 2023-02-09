import { Router } from 'express';
import goalRouter from './goal';
import stateRouter from './state';

const router = Router();

router.use('/goals', goalRouter);
router.use('/states', stateRouter);

export default router;
