import { Listener, Subjects, OrderCreatedEvent } from '@tickeing-sm/common'
import { Message } from 'node-nats-streaming';
import Ticket from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';
export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
    queueGroupName = 'tickets-service';
    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        const { ticket, id: orderId } = data;
        const { id: ticketId } = ticket;
        const ticketDoc = await Ticket.findById(ticketId).exec();
        if (!ticketDoc) {
            throw new Error('Ticket not found');
        }
        ticketDoc.set({ orderId });
        await ticketDoc.save();
        await new TicketUpdatedPublisher(this.client).publish({
            id: ticketDoc.id,
            version: ticketDoc.version,
            title: ticketDoc.title,
            price: ticketDoc.price,
            userId: ticketDoc.userId,
            orderId: ticketDoc.orderId
        })
        msg.ack();
    }
}

