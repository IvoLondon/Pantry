import { Router } from 'express';
import { controllers } from './stock.controllers';
import withAuth from './../../middlewares/auth';

const router = Router();
router.use(withAuth);
router.route('/stock')
    .get(controllers.getStockItems)
    .post(controllers.createStock);

router.route('/stock/:id')
    .post(controllers.addItemToStock)
    .get(controllers.getItemFromStock);

export default router;

