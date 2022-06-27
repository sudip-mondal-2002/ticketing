import request from 'supertest'
import app from '../../app'
import Ticket from '../../models/ticket'
import mongoose from 'mongoose';
it('gets certain order', async () => {
    const ticket = Ticket.build({
        price: 20
    })
    await ticket.save()

    const user = global.signup()

    const { body: order1 } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201)

    const { body: order2 } = await request(app)
        .get(`/api/orders/${order1.id}`)
        .set('Cookie', user)
        .expect(200)

    expect(order1.id).toEqual(order2.id)
})

it('refuses authorization', async () => {
    const ticket = Ticket.build({
        price: 20
    })
    await ticket.save()

    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', global.signup())
        .send({ ticketId: ticket.id })
        .expect(201)

    await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', global.signup())
        .expect(401)
})

it('refuses to get non-existing order', async () => {
    const ticketID = new mongoose.Types.ObjectId()
    await request(app)
        .get(`/api/orders/${ticketID}`)
        .set('Cookie', global.signup())
        .expect(404)
})