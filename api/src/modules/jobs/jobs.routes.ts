import { authMiddleware } from '@/shared/middlewares/auth.middleware';
import { upload } from '@config/cloudinary';
import { validateBody } from '@shared/middlewares/validate.middleware';
import { Router } from 'express';
import { jobsController } from './jobs.controller';
import { createJobSchema } from './jobs.schema';

const router: Router = Router();

router.get('/', jobsController.list);

router.get('/:id', jobsController.getById);

router.post('/', authMiddleware, upload.single('banner'), validateBody(createJobSchema), jobsController.create);

export default router;
