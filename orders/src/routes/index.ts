import { Router, Request, Response} from 'express';
import { requireAuth } from '@tickeing-sm/common';
import Order from './../models/order';

const router = Router()

router.get('/api/orders', requireAuth, async(req: Request, res: Response) => {
    const orders = await Order.find({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        userId: req.currentUser!.id
    }).populate('ticket').exec()
    res.json(orders)
})

export default router