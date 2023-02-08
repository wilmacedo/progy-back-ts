import { Router } from 'express';
import { Institution } from '../controllers/Institution';

const institutionRouter = Router();
const controller = new Institution();

institutionRouter.post('/', controller.create);

export { institutionRouter };
