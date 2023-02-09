import { Router } from 'express';
import { User } from '../controllers/user';
import { permission, roles, verify } from '../middleware';
import { AuthController } from '../middleware/auth';

const router = Router();
const controller = new User();
const auth = new AuthController();

router.post('/login', controller.login);

router.use(auth.verify, verify(roles.low), permission);

router.get('/me', controller.me);
router.post('/change-password', controller.updatePassword);

router.use(auth.verify, verify(roles.high), permission);

router.post('/', controller.create);
router.get('/', controller.findMany);
router.get('/:id', controller.findOne);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;
