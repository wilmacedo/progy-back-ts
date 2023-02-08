import { Router } from 'express';
import { User } from '../controllers/User';

const userRouter = Router();
const controller = new User();

userRouter.post('/', controller.create);

export { userRouter };
