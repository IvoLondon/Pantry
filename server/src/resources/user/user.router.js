import { Router } from 'express';
import { controllers } from './user.controllers';
import auth from './../../middlewares/auth';

const router = Router();

router.route('/signup')
    .post(controllers.createUser);

router.route('/signin')
    .post(controllers.signInUser);

router.get('/checkAuth', auth, controllers.checkAuth);

export default router;