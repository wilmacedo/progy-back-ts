import { Router } from 'express';
import { permission, roles, verify } from '../../../middleware';
import { AuthController } from '../../../middleware/auth';
import initiativeRouter from './initiative';

const router = Router();
const auth = new AuthController();

router.use(auth.verify, verify(roles.low), permission);

router.use('/initiative', initiativeRouter);

export default router;
