import { Router } from 'express';
import { FormController } from '../controllers/form';
import { permission, roles, verify } from '../middleware';
import { AuthController } from '../middleware/auth';

const router = Router();
const controller = new FormController();
const auth = new AuthController();

router.use(auth.verify, verify(roles.high), permission);

router.use('/', controller.create);

export default router;
