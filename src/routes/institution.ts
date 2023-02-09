import { Router } from 'express';
import { Institution } from '../controllers/institution';

const router = Router();
const controller = new Institution();

router.post('/', controller.create);
router.get('/', controller.findMany);
router.get('/:id', controller.findOne);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;
