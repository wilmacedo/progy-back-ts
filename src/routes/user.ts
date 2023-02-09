import { Router } from 'express';
import { User } from '../controllers/User';

const router = Router();
const controller = new User();

router.post('/', controller.create);
router.get('/', controller.findMany);
router.get('/:id', controller.findOne);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;
