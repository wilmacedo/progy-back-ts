import { Router } from 'express';
import { RoleController } from '../controllers/Role';

const router = Router();
const controller = new RoleController();

router.post('/', controller.create);
router.get('/', controller.findMany);
router.get('/:id', controller.findOne);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;
