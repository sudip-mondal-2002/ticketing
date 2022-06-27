/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { OrderStatus } from '@tickeing-sm/common';
import Order from './../order';
import Ticket from './../ticket';

it('implements optimistic concurrency control', async () => {
    const ticket = Ticket.build({
        price: 20
    })
    await ticket.save();
    const order = Order.build({
        userId: '123',
        status: OrderStatus.Created,
        expiresAt: new Date(),
        ticket: ticket
    })
    await order.save();
    const firstInstance = await Order.findById(order.id).exec();
    const secondInstance = await Order.findById(order.id).exec();
    firstInstance!.set({ status: OrderStatus.Cancelled });
    await firstInstance!.save();
    try {
        await secondInstance!.save();
    } catch (err) {
        return;
    }
    throw new Error('Should not reach this point');
})

it('increments the version number on multiple saves', async () => {
    const ticket = Ticket.build({
        price: 20
    })
    await ticket.save();
    const order = Order.build({
        userId: '123',
        status: OrderStatus.Created,
        expiresAt: new Date(),
        ticket: ticket
    })
    await order.save();
    expect(order.version).toEqual(0);
    await order.save();
    expect(order.version).toEqual(1);
    await order.save();
    expect(order.version).toEqual(2);

})