import { Router } from 'express';
import { Institution } from '../controllers/institution';

const router = Router();
const controller = new Institution();

router.post('/', controller.create);

export default router;
