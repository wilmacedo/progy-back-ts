import { Router } from 'express';
import { User } from '../controllers/user';
import { permission, roles, verify } from '../middleware';
import { AuthController } from '../middleware/auth';

const router = Router();
const controller = new User();
const auth = new AuthController();

router.post('/login', controller.login);

router.use(auth.verify, verify(roles.high), permission);

router.post('/', auth.verify, controller.create);
router.get('/', auth.verify, controller.findMany);
router.get('/:id', auth.verify, controller.findOne);
router.put('/:id', auth.verify, controller.update);
router.delete('/:id', auth.verify, controller.delete);

export default router;
