import { Request, Response, Router } from 'express';
import { requireAuth, validateRequest, DatabaseConnectionError } from '@tickeing-sm/common';
import { body } from 'express-validator';
import Ticket from '../models/ticket';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
import { natsWrapper } from '../nats-wrapper';
const router = Router();

router.post('/api/tickets', requireAuth, [
    body('title')
        .not().isEmpty().withMessage('Title is required'),
    body('price')
        .isFloat({ gt: 0 }).withMessage('Price must be provided and must be greater than 0')
], validateRequest, async (req: Request, res: Response) => {
    const { title, price } = req.body;
    const ticket = Ticket.build({
        title,
        price,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        userId: req.currentUser!.id
    });
    try{
        await ticket.save();
        await new TicketCreatedPublisher(natsWrapper.client).publish({
            id: ticket.id,
            version: ticket.version,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId
        });
        res.status(201).json(ticket);
    }catch(err){
        throw new DatabaseConnectionError()
    }
})

export default router