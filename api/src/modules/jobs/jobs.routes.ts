import { authMiddleware } from '@/shared/middlewares/auth.middleware';
import { upload } from '@/shared/providers/cloudinary.provider';
import { validateBody } from '@shared/middlewares/validate.middleware';
import { Router } from 'express';
import { jobsController } from './jobs.controller';
import { createJobSchema } from './jobs.schema';

const router: Router = Router();

router.get('/', jobsController.list);
router.get('/me', authMiddleware, jobsController.listByCompany);
router.get('/:id', jobsController.getById);

router.post(
  '/',
  authMiddleware,
  upload.single('image'),
  validateBody(createJobSchema),
  jobsController.create,
);

router.post('/:id/renovar', authMiddleware, jobsController.renew);

export default router;
