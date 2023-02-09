import { Router } from 'express';
import goalRouter from './goal';

const router = Router();

router.use('/goals', goalRouter);

export default router;
