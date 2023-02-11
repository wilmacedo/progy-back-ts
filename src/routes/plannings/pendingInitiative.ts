import { Router } from 'express';
import PendingInitiativeController from '../../controllers/plannigs/pendingInitiative';
import { permission, roles, verify } from '../../middleware';
import { AuthController } from '../../middleware/auth';

const router = Router();
const controller = new PendingInitiativeController();
const auth = new AuthController();

router.use(auth.verify, verify(roles.high), permission);

router.get('/', controller.findMany);
router.get('/:id', controller.findOne);
router.delete('/decline/:id', controller.decline);
router.get('/accept/:id', controller.accept);

export default router;
