import { NotAuthorizedError, NotFoundError, OrderStatus, requireAuth } from '@tickeing-sm/common';
import { Router, Request, Response} from 'express';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import Order from '../models/order';
import { natsWrapper } from '../nats-wrapper';

const router = Router()

router.delete('/api/orders/:orderId',requireAuth, async(req: Request, res: Response) => {
    const { orderId } = req.params
    const order = await Order.findById(orderId)
    if (!order) {
        throw new NotFoundError()
    }
    if(order.userId !== req.currentUser?.id) {
        throw new NotAuthorizedError()
    }
    order.status = OrderStatus.Cancelled
    await order.save()

    await new OrderCancelledPublisher(natsWrapper.client).publish({
        id: order.id,
        version: order.version,
        ticket: {
            id: order.ticket.id
        }
    })
    res.status(204).json(order)
})

export default router