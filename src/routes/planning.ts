import { Router } from 'express';
import { PlanningController } from '../controllers/planning';
import { getPlanning, permission, roles, verify } from '../middleware';
import { AuthController } from '../middleware/auth';
import planningRouter from './plannings';

const router = Router();
const controller = new PlanningController();
const auth = new AuthController();

router.use('/:planning_id', getPlanning, planningRouter);

router.use(auth.verify, verify(roles.low), permission);
router.get('/', controller.findMany);
router.get('/:id', controller.findOne);

router.use(auth.verify, verify(roles.high), permission);

router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;
