import { Router } from 'express';
import { EmailController } from '../controllers/email';

const router = Router();
const controller = new EmailController();

router.get('/verify', controller.verifyMail);
router.get('/acceptInvite', controller.acceptInvite);

export default router;
