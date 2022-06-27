import mongoose from 'mongoose';
import { natsWrapper } from '../../../nats-wrapper';
import { TicketCreatedListener } from './../ticket-created-listener';
import { TicketCreatedEvent } from '@tickeing-sm/common';
import { Message } from 'node-nats-streaming';
import Ticket from '../../../models/ticket';
const setup = async () => {
    const listener = new TicketCreatedListener(natsWrapper.client);
    const data: TicketCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        price: 20,
        title: 'concert',
        userId: new mongoose.Types.ObjectId().toHexString()
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }
    return { listener, data, msg };
}

it('Create and save a ticket', async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    const ticket = await Ticket.findById(data.id);
    expect(ticket).toBeDefined();
    expect(ticket?.price).toEqual(data.price);
    expect(ticket?.version).toEqual(data.version);
})

it('Ack the message', async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
})
