import { OrderCreatedListener } from "../order-created-listener";
import { OrderCreatedEvent, OrderStatus } from '@tickeing-sm/common';
import { natsWrapper } from "../../../nats-wrapper";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import Order from "../../../models/order";

const setup = () => {
    const listener = new OrderCreatedListener(natsWrapper.client);
    const order: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        userId: new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        expiresAt: new Date().toISOString(),
        ticket: {
            id: new mongoose.Types.ObjectId().toHexString(),
            price: 20
        }
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const msg:Message = {
        ack: jest.fn()
    };

    return { listener, order, msg };
}

it('acks the message', async () => {
    const { listener, order, msg } = setup();

    await listener.onMessage(order, msg);

    expect(msg.ack).toHaveBeenCalled();
})

it('replicates the order', async () => {
    const { listener, order, msg } = setup();

    await listener.onMessage(order, msg);

    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder?.id).toEqual(order.id);
    expect(updatedOrder?.price).toEqual(order.ticket.price);
    expect(updatedOrder?.status).toEqual(order.status);
})