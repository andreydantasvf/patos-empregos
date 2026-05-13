import { Router } from 'express';
import { adminController } from './admin.controller';
import { authMiddleware } from '@shared/middlewares/auth.middleware';
import { adminMiddleware } from '@shared/middlewares/admin.middleware';

const router = Router();

// Apply auth + admin guard to all routes in this router
router.use(authMiddleware, adminMiddleware);

/**
 * @openapi
 * /admin/jobs:
 *   get:
 *     tags: [Admin]
 *     summary: Listar todas as vagas (todas as status)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [PENDING, APPROVED, REJECTED] }
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Lista de vagas
 *       401:
 *         description: Não autorizado
 */
router.get('/jobs', adminController.listJobs);

/**
 * @openapi
 * /admin/jobs/{id}/approve:
 *   patch:
 *     tags: [Admin]
 *     summary: Aprovar vaga
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Vaga aprovada
 *       404:
 *         description: Vaga não encontrada
 */
router.patch('/jobs/:id/approve', adminController.approveJob);

/**
 * @openapi
 * /admin/jobs/{id}/reject:
 *   patch:
 *     tags: [Admin]
 *     summary: Rejeitar vaga
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Vaga rejeitada
 */
router.patch('/jobs/:id/reject', adminController.rejectJob);

/**
 * @openapi
 * /admin/jobs/{id}:
 *   delete:
 *     tags: [Admin]
 *     summary: Remover vaga
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Vaga removida
 */
router.delete('/jobs/:id', adminController.deleteJob);

export default router;
