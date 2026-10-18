import { authMiddleware } from '@shared/middlewares/auth.middleware';
import { Router } from 'express';
import { paymentsController } from './payments.controller';

const router: Router = Router();

router.get('/:jobId/status', authMiddleware, paymentsController.getStatus);

router.post('/webhook/mercadopago', paymentsController.handleWebhook);

export default router;
