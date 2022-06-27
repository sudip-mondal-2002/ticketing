import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketUpdatedEvent, NotFoundError } from "@tickeing-sm/common";
import Ticket from '../../models/ticket';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
    queueGroupName = 'orders-service';
    async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
        const { id, version, price } = data;
        const ticket = await Ticket.findByEvent({ id, version });

        if (!ticket) {
            throw new NotFoundError();
        }
        if (ticket.price !== price) {
            ticket.set({ price });
        }
        await ticket.save();
        msg.ack();
    }
}