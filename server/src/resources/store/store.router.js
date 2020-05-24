import { Router } from 'express';
import { controllers } from './store.controllers';
import withAuth from './../../middlewares/auth';

const router = Router();
router.use(withAuth);
router.route('/store')
    .get(controllers.getMany)
    .post(controllers.createOne);

router.route('/store/field')
    .get(controllers.getOneByField)

router.route('/store/:id')
    .get(controllers.getOne)
    .put(controllers.updateOne)
    .delete(controllers.removeOne);



export default router;

