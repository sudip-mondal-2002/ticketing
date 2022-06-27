import request from 'supertest'
import app from '../../app'
import Ticket from '../../models/ticket'

const createTicket = async () => {
    const ticket = Ticket.build({
        price: 20
    })
    await ticket.save()

    return ticket
}


it('fetches orders for a user', async () => {
    const ticket1 = await createTicket()
    const ticket2 = await createTicket()
    const ticket3 = await createTicket()

    const user1 = global.signup()
    const user2 = global.signup()

    await request(app)
        .post('/api/orders')
        .set('Cookie', user1)
        .send({ ticketId: ticket1.id })
        .expect(201)

    const { body: order1 } = await request(app)
        .post('/api/orders')
        .set('Cookie', user2)
        .send({ ticketId: ticket2.id })
        .expect(201)
    const { body: order2 } = await request(app)
        .post('/api/orders')
        .set('Cookie', user2)
        .send({ ticketId: ticket3.id })
        .expect(201)

    const response = await request(app)
        .get('/api/orders')
        .set('Cookie', user2)
        .expect(200)

    expect(response.body.length).toEqual(2)

    const expectedIDs = [order1.id, order2.id]
    expect(expectedIDs).toContain(response.body[0].id)
    expect(expectedIDs).toContain(response.body[1].id)
})