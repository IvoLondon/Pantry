import { Router } from 'express';
import controllers from './item.controllers';

const router = Router();

router.route('/item')
    .get(controllers.getMany)
    .post(controllers.createOne);

router.route('/item/field')
    .get(controllers.getOneByField)

router.route('/item/:id')
    .get(controllers.getOne)
    .put(controllers.updateOne)
    .delete(controllers.removeOne);



export default router;

