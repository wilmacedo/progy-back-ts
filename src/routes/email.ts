import { Router } from 'express';
import { EmailController } from '../controllers/email';

const router = Router();
const controller = new EmailController();

router.get('/verify', controller.verifyMail);
router.get('/invite/redirect', controller.inviteRedirect);
router.post('/invite/create', controller.createByInvite);

export default router;
