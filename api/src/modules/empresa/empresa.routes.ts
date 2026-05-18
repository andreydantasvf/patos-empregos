import { authMiddleware } from '@shared/middlewares/auth.middleware';
import { Router } from 'express';
import { empresaController } from './empresa.controller';

const router: Router = Router();

router.use(authMiddleware);

router.get('/perfil', empresaController.getProfile);
router.patch('/perfil', empresaController.updateProfile);

export default router;
