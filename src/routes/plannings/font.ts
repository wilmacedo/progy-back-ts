import { Router } from 'express';
import { FontController } from '../../controllers/plannigs/font';
import { permission, roles, verify } from '../../middleware';
import { AuthController } from '../../middleware/auth';

const router = Router();
const controller = new FontController();
const auth = new AuthController();

router.use(auth.verify, verify(roles.high), permission);

router.post('/', controller.create);
router.get('/', controller.findMany);
router.get('/:id', controller.findOne);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;
