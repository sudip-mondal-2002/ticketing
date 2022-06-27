import { Router, Request, Response } from 'express';
import Ticket from '../models/ticket';
import { DatabaseConnectionError } from '@tickeing-sm/common';

const router = Router();

router.get('/api/tickets', async (req: Request, res: Response) => {
    try {
        const tickets = await Ticket.find({
            orderId: undefined
        }).exec();
        res.send(tickets || []);
    } catch {
        throw new DatabaseConnectionError();
    }
})

export default router;