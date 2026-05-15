import { adminMiddleware } from '@shared/middlewares/admin.middleware';
import { authMiddleware } from '@shared/middlewares/auth.middleware';
import { Router } from 'express';
import { adminController } from './admin.controller';

const router: Router = Router();

// Apply auth + admin guard to all routes in this router
router.use(authMiddleware, adminMiddleware);

router.get('/jobs', adminController.listJobs);

router.delete('/jobs/:id', adminController.deleteJob);

export default router;
