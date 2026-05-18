import { validateBody } from '@/shared/middlewares/validate.middleware';
import { adminMiddleware } from '@shared/middlewares/admin.middleware';
import { authMiddleware } from '@shared/middlewares/auth.middleware';
import { upload } from '@shared/providers/cloudinary.provider';
import { Router } from 'express';
import { adminController } from './admin.controller';
import { createFreeJobSchema, updateJobStatusSchema } from './admin.schema';

const router: Router = Router();

router.use(authMiddleware, adminMiddleware);

// ─── Jobs ─────────────────────────────────────────────────────────────────────
router.post('/jobs', upload.single('image'), validateBody(createFreeJobSchema), adminController.createFreeJob);
router.get('/jobs', adminController.listJobs);
router.patch('/jobs/:id/status', validateBody(updateJobStatusSchema), adminController.updateJobStatus);
router.delete('/jobs/:id', adminController.deleteJob);
router.post('/jobs/:id/repostar', adminController.repostJob);

// ─── Empresas ─────────────────────────────────────────────────────────────────
router.get('/empresas', adminController.listCompanies);
router.get('/empresas/:id', adminController.getCompany);
router.patch('/empresas/:id/bloquear', adminController.toggleBlock);

// ─── Configurações ────────────────────────────────────────────────────────────
router.get('/configuracoes', adminController.getSettings);

export default router;
