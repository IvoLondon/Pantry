import { Router } from 'express';
import { controllers } from './user.controllers';

const router = Router();

router.route('/user')
    .post(controllers.createUser);

export default router;