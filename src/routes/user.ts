import { Router } from 'express';
import { User } from '../controllers/User';

const router = Router();
const controller = new User();

router.post('/', controller.create);
router.get('/:id', controller.findOne);

export default router;
