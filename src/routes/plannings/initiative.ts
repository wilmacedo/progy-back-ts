import { Router } from 'express';
import { InitiativeController } from '../../controllers/plannigs/initiative';

const router = Router();
const controller = new InitiativeController();

router.post('/', controller.create);
router.get('/', controller.findMany);
router.get('/:id', controller.findOne);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;
