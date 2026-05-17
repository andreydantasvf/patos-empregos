import { validateBody } from '@/shared/middlewares/validate.middleware';
import { adminMiddleware } from '@shared/middlewares/admin.middleware';
import { authMiddleware } from '@shared/middlewares/auth.middleware';
import { Router } from 'express';
import { adminController } from './admin.controller';
import { updateStatusSchema } from './admin.schema';

const router: Router = Router();

// Apply auth + admin guard to all routes in this router
router.use(authMiddleware, adminMiddleware);

router.get('/jobs', adminController.listJobs);

router.patch('/jobs/:id/status', validateBody(updateStatusSchema), adminController.updateStatus);

router.delete('/jobs/:id', adminController.deleteJob);

export default router;
