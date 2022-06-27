import mongoose from 'mongoose';
import { natsWrapper } from '../../../nats-wrapper';
import { TicketUpdatedListener } from './../ticket-updated-listener';
import { TicketUpdatedEvent } from '@tickeing-sm/common';
import { Message } from 'node-nats-streaming';
import Ticket from '../../../models/ticket';
const setup = async () => {
    const listener = new TicketUpdatedListener(natsWrapper.client);
    const ticket = Ticket.build({
        price: 20,
    })
    await ticket.save();
    const data: TicketUpdatedEvent['data'] = {
        id: ticket.id,
        version: ticket.version + 1,
        price: 1234,
        title: 'concert',
        userId: new mongoose.Types.ObjectId().toHexString()
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }
    return { listener, data, msg, ticket };
}

it('Updates a ticket', async () => {
    const { listener, data, msg, ticket } = await setup();
    await listener.onMessage(data, msg);
    const updatedTicket = await Ticket.findById(ticket.id);
    expect(updatedTicket).toBeDefined();
    expect(updatedTicket?.price).toEqual(data.price);
    expect(updatedTicket?.version).toEqual(data.version);
})

it('Ack the message', async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
})

it('does not call ack', async () => {
    const { listener, data, msg } = await setup();
    data.version = 10;
    try {
        await listener.onMessage(data, msg);
        // eslint-disable-next-line no-empty
    } catch (e) { }
    expect(msg.ack).not.toHaveBeenCalled();
})