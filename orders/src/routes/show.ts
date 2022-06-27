import { NotAuthorizedError, NotFoundError, requireAuth } from '@tickeing-sm/common';
import { Router, Request, Response} from 'express';
import Order from '../models/order';

const router = Router()

router.get('/api/orders/:orderId',requireAuth, async(req: Request, res: Response) => {
    const { orderId } = req.params
    const order = await Order.findById(orderId).populate('ticket')
    if (!order) {
        throw new NotFoundError()
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if(order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError()
    }

    res.json(order)
})

export default router