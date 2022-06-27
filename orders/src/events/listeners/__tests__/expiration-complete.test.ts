import { ExpirationCompleteListener } from "../expiration-completed-listener";
import { ExpirationCompleteEvent, OrderStatus } from "@tickeing-sm/common";
import { Message } from "node-nats-streaming";
import { natsWrapper } from "../../../nats-wrapper";
import Ticket from "../../../models/ticket";
import Order from "../../../models/order";
const setup = async () => {
    const listener = new ExpirationCompleteListener(natsWrapper.client);

    const ticket = Ticket.build({
        price: 20,
    })
    await ticket.save();
    const order = Order.build({
        status: OrderStatus.Created,
        userId: "asdf",
        expiresAt: new Date(),
        ticket,
    })
    await order.save();

    const data: ExpirationCompleteEvent['data'] = {
        orderId: order.id
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return { listener, data, msg, order, ticket };
}

it('updates the order status to cancelled', async () => {
    const { listener, data, msg, order } = await setup();

    await listener.onMessage(data, msg);

    const updatedOrder = await Order.findById(order.id);
    expect(updatedOrder?.status).toEqual(OrderStatus.Cancelled);
    expect(updatedOrder?.version).toEqual(order.version + 1);
})

it('acks the message', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
})

it('publishes a OrderCancelled event', async () => {
    const { listener, data, msg, order, ticket } = await setup();

    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
    expect(eventData.id).toEqual(order.id);
    expect(eventData.version).toEqual(order.version + 1);
    expect(eventData.ticket.id).toEqual(ticket.id);
})