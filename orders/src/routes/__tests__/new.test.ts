import request from 'supertest'
import app from '../../app'
import mongoose from 'mongoose'

import Ticket from '../../models/ticket'
import Order from '../../models/order'
import { OrderStatus } from '@tickeing-sm/common';
import { natsWrapper } from '../../nats-wrapper';

it('return an error if the ticket not exist', async () => {
    const ticketId = new mongoose.Types.ObjectId()
    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signup())
        .send({ ticketId })
        .expect(404)
})
it('return an error if the ticket is reserved', async () => {
    const ticket = Ticket.build({
        price: 20
    })
    await ticket.save()

    const order = Order.build({
        ticket,
        userId: 'FakeUserID',
        status: OrderStatus.Created,
        expiresAt: new Date()
    })

    await order.save()

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signup())
        .send({ ticketId: ticket.id })
        .expect(400)
})
it('reserve a ticket', async () => {
    const ticket = Ticket.build({
        price: 20
    })

    await ticket.save();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signup())
        .send({ ticketId: ticket.id })
        .expect(201)
})

it('Publishes an event', async () => {
    const ticket = Ticket.build({
        price: 20
    })

    await ticket.save();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signup())
        .send({ ticketId: ticket.id })
        .expect(201)

    expect(natsWrapper.client.publish).toHaveBeenCalled()
})