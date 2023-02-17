import { Router } from 'express';
import { SheetController } from '../../controllers/plannigs/sheet';

const router = Router();
const controller = new SheetController();

router.post('/:table', controller.generate);

export default router;
