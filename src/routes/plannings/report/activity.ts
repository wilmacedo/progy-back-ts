import { Router } from 'express';
import { InitiativeReportController } from '../../../controllers/plannigs/reports/activity';

const router = Router();
const controller = new InitiativeReportController();

router.post('/', controller.generate);

export default router;
