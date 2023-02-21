import { Router } from 'express';
import { permission, roles, verify } from '../../../middleware';
import { AuthController } from '../../../middleware/auth';
import initiativeRouter from './initiative';
import activityRouter from './activity';

const router = Router();
const auth = new AuthController();

router.use(auth.verify, verify(roles.low), permission);

router.use('/initiative', initiativeRouter);
router.use('/activity', activityRouter);

export default router;
