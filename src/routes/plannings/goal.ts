import { Router } from 'express';
import { GoalController } from '../../controllers/plannigs/goal';
import { permission, roles, verify } from '../../middleware';
import { AuthController } from '../../middleware/auth';

const router = Router();
const controller = new GoalController();
const auth = new AuthController();

router.use(auth.verify, verify(roles.low), permission);

router.get('/', controller.findMany);
router.get('/:id', controller.findOne);

router.use(auth.verify, verify(roles.high), permission);

router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;
