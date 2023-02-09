import { Router } from 'express';
import userView from './user';

const router = Router();
router.use(userView);

export default router;
