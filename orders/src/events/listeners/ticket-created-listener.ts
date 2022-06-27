import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketCreatedEvent } from "@tickeing-sm/common";
import Ticket from '../../models/ticket';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
    queueGroupName = 'orders-service';
    async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
        const { id, price } = data;
        const ticket = Ticket.build({
            price
        });
        ticket.set({ _id: id });
        await ticket.save();
        msg.ack();
    }
}