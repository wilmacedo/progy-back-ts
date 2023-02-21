import { Router } from 'express';
import multer from 'multer';
import ActivityController from '../../controllers/plannigs/activity';
import { permission, roles, verify } from '../../middleware';
import { AuthController } from '../../middleware/auth';
import multerConfig from '../../config/multer';

const router = Router();
const controller = new ActivityController();
const auth = new AuthController();
const multerMiddleware = multer(multerConfig).single('file');

router.use(auth.verify, verify(roles.low), permission);

router.post('/', multerMiddleware, controller.create);
router.get('/delayed', controller.getDelayed);
router.get('/', controller.findMany);
router.get('/:id', controller.findOne);
router.put('/:id', controller.update);
router.get('/:id/file', controller.getFile);

router.use(auth.verify, verify(roles.high), permission);
router.delete('/:id', controller.delete);

export default router;
