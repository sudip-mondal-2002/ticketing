import { Router, Request, Response } from 'express';
import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@tickeing-sm/common';
import { body } from 'express-validator';
import Ticket from '../models/ticket';
import Order from '../models/order';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const EXPIRATION_WINDOW_SECONDS = 1 * 60

const router = Router()

router.post('/api/orders', requireAuth, [
    body('ticketId')
        .not()
        .isEmpty()
        .withMessage('TicketId is required')
], validateRequest, async (req: Request, res: Response) => {

    const { ticketId } = req.body
    const ticket = await Ticket.findById(ticketId).exec();
    if (!ticket) {
        throw new NotFoundError()
    }
    const reserved = await ticket.isReserved()
    if (reserved) {
        throw new BadRequestError('Ticket is already reserved')
    }
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS)

    const order = Order.build({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        userId: req.currentUser!.id,
        status: OrderStatus.Created,
        expiresAt: expiration,
        ticket
    })

    order.save()

    await new OrderCreatedPublisher(natsWrapper.client).publish({
        id: order.id,
        version: order.version,
        status: order.status,
        userId: order.userId,
        expiresAt: order.expiresAt.toISOString(),
        ticket: {
            id: ticket.id,
            price: ticket.price
        }
    })

    res.status(201).json(order)
})

export default router