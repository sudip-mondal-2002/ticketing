import request from 'supertest';
import app from '../../app';
import Ticket from '../../models/ticket';
import mongoose from 'mongoose';
import Order from '../../models/order';
import { OrderStatus } from '@tickeing-sm/common';
import { natsWrapper } from '../../nats-wrapper';

it('deletes an order', async () => {
    const ticket = Ticket.build({
        price: 20
    });
    await ticket.save();

    const user = global.signup();

    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201);

    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .expect(204);

    const deletedOrder = await Order.findById(order.id);
    expect(deletedOrder?.status).toEqual(OrderStatus.Cancelled);
})

it('Cant delete a non- existing order', async () => {
    const orderId = new mongoose.Types.ObjectId();
    await request(app)
        .delete(`/api/orders/${orderId}`)
        .set('Cookie', global.signup())
        .expect(404);
})

it('Refuses to do unauthorised deletion', async () => {
    const ticket = Ticket.build({
        price: 20
    });
    await ticket.save();

    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', global.signup())
        .send({ ticketId: ticket.id })
        .expect(201);

    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', global.signup())
        .expect(401);
})

it('Publishes an event', async () => {
    const ticket = Ticket.build({
        price: 20
    });
    await ticket.save();

    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', global.signup())
        .send({ ticketId: ticket.id })
        .expect(201);

    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', global.signup())
        .expect(401);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
})