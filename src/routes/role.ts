import { Router } from 'express';
import { RoleController } from '../controllers/Role';

const roleRouter = Router();
const controller = new RoleController();

roleRouter.post('/', controller.create);

export { roleRouter };
