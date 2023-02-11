import { Router } from 'express';
import { InitiativeController } from '../../controllers/plannigs/initiative';
import { permission, roles, verify } from '../../middleware';
import { AuthController } from '../../middleware/auth';

const router = Router();
const controller = new InitiativeController();
const auth = new AuthController();

router.use(auth.verify, verify(roles.low), permission);
router.get('/', controller.findMany);
router.get('/:id', controller.findOne);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.get('/:id/file', controller.getFile);

router.use(auth.verify, verify(roles.high), permission);
router.delete('/:id', controller.delete);

export default router;
