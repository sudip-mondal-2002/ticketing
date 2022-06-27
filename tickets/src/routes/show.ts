import { Router, Request, Response } from 'express';
import { NotFoundError } from '@tickeing-sm/common';
import Ticket from '../models/ticket';

const router = Router()
router.get('/api/tickets/:id', async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id).exec();
    if (!ticket) {
        throw new NotFoundError();
    }
    res.send(ticket);
})


export default router;