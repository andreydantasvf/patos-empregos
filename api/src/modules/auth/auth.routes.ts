import { validateBody } from '@shared/middlewares/validate.middleware';
import { Router } from 'express';
import { authController } from './auth.controller';
import { adminLoginSchema, loginSchema, registerSchema } from './auth.schema';

const router: Router = Router();

router.post('/login', validateBody(loginSchema), authController.login);
router.post('/register', validateBody(registerSchema), authController.register);
router.post('/admin/login', validateBody(adminLoginSchema), authController.adminLogin);

export default router;
