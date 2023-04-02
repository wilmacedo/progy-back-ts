import { Router } from 'express';
import { RoleController } from '../controllers/role';
import { permission, roles, verify } from '../middleware';
import { AuthController } from '../middleware/auth';

const router = Router();
const controller = new RoleController();
const auth = new AuthController();

router.get('/:id', controller.findOne);

router.use(auth.verify, verify(roles.high), permission);

router.post('/', controller.create);
router.get('/', controller.findMany);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;
