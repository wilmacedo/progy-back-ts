import { Router } from 'express';
import userView from './user';
import roleView from './role';

const router = Router();
router.use(userView);
router.use(roleView);

export default router;
