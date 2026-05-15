import { validateBody } from '@shared/middlewares/validate.middleware';
import { Router } from 'express';
import { jobsController } from './jobs.controller';
import { createJobSchema } from './jobs.schema';
import { upload } from '@config/cloudinary';

const router: Router = Router();

/**
 * @openapi
 * /jobs:
 *   get:
 *     tags: [Jobs]
 *     summary: Listar vagas aprovadas
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: city
 *         schema: { type: string }
 *       - in: query
 *         name: type
 *         schema: { type: string, enum: [CLT, PJ, FREELANCER, INTERNSHIP, TEMPORARY] }
 *       - in: query
 *         name: company
 *         schema: { type: string }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Lista paginada de vagas aprovadas
 */
router.get('/', jobsController.list);

/**
 * @openapi
 * /jobs/{id}:
 *   get:
 *     tags: [Jobs]
 *     summary: Detalhes de uma vaga
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Detalhes da vaga
 *       404:
 *         description: Vaga não encontrada
 */
router.get('/:id', jobsController.getById);

/**
 * @openapi
 * /jobs:
 *   post:
 *     tags: [Jobs]
 *     summary: Cadastrar nova vaga (público)
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/CreateJob'
 *             properties:
 *               banner:
 *                 type: string
 *                 format: binary
 *                 description: Imagem de banner da vaga (max 5 MB)
 *             required:
 *               - banner
 *     responses:
 *       201:
 *         description: Vaga cadastrada e aguardando aprovação
 *       422:
 *         description: Dados inválidos ou banner ausente
 */
router.post('/', upload.single('banner'), validateBody(createJobSchema), jobsController.create);

export default router;
