import { Router } from 'express';
import controllers from './item.controllers';

const router = Router();

router.route('/item')
    .get(controllers.getOne)
    .post(controllers.createOne);

router.route('/item/:id')
    .get(controllers.getOne)
    .put(controllers.updateOne)
    .delete(controllers.removeOne);

export default router;

