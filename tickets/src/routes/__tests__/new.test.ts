import request from 'supertest'
import app from '../../app'
import Ticket from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';
it('has a route handler listening to /api/tickets for post request', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .send({});
    expect(response.status).not.toEqual(404)
})

it('can not be accessed if user is not signed in', async () => {
    const response = await request(app)
        .post('/api/tickets')
    expect(response.status).toEqual(401)
})

it('can be accessed if user is signed in', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signup())
        .send({})
    expect(response.status).not.toEqual(401)
})

it('returns an error if an invalid title is provided', async () => {
    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signup())
        .send({
            title: '',
            price: '10'
        })
        .expect(400)
    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signup())
        .send({
            price: '10'
        })
        .expect(400)
})

it('returns an error if an invalid price is provided', async () => {
    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signup())
        .send({
            title: 'title',
            price: '-10'
        })
        .expect(400)
    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signup())
        .send({
            title: 'title'
        })
        .expect(400)
})

it('creates a ticket with valid inputs', async () => {
    let tickets = await Ticket.find({}).exec()
    expect(tickets).toHaveLength(0)

    const title = 'title';
    const price = 10;

    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signup())
        .send({
            title, price
        })
        .expect(201)

    tickets = await Ticket.find({}).exec()
    expect(tickets).toHaveLength(1)
    expect(tickets[0].price).toEqual(price)
    expect(tickets[0].title).toEqual(title)
})

it('Publishes an event', async () => {
    const title = 'title';
    const price = 10;

    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signup())
        .send({
            title, price
        })
        .expect(201)
    expect(natsWrapper.client.publish).toHaveBeenCalled()
})