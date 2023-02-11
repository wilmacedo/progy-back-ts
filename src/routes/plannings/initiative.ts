import { Router } from 'express';
import { InitiativeController } from '../../controllers/plannigs/initiative';

const router = Router();
const controller = new InitiativeController();

router.post('/', controller.create);
router.get('/', controller.findMany);

export default router;
