import { Router } from 'express';
import { Institution } from '../controllers/Institution';

const router = Router();
const controller = new Institution();

router.post('/', controller.create);

export default router;
