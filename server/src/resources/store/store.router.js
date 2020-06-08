import { Router } from 'express';
import { controllers } from './store.controllers';
import withAuth from './../../middlewares/auth';

const router = Router();
router.use(withAuth);
router.route('/store')
    .post(controllers.createItemInStore);

router.route('/store/find')
    .get(controllers.getOneByField)

router.route('/store/:id')
    .get(controllers.getOne)
    .put(controllers.updateOne)
    .delete(controllers.removeOne);



export default router;

