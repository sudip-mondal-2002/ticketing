import request from 'supertest'
import app from '../../app'
import Ticket from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';
import mongoose from 'mongoose'
it('returns a 404 if ticket not found', async () => {
    const id = global.fakeTicketId()
    await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', global.signup())
        .send({
            title: 'new title',
            price: 20
        })
        .expect(404);
})

it('returns a 401 if user is not authenticated', async () => {
    const id = global.fakeTicketId()
    await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title: 'new title',
            price: 20
        })
        .expect(401);
})


it('returns 401 if user does not own the ticket', async () => {
    const res = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signup())
        .send({
            title: 'title',
            price: 20
        })
        .expect(201)
    await request(app)
        .put(`/api/tickets/${res.body.id}`)
        .set('Cookie', global.signup())
        .send({
            title: 'new title',
            price: 200
        })
        .expect(401)
})

it('returns a 400 if invalid title or price is provided', async () => {
    const token = global.signup()
    const res = await request(app)
        .post('/api/tickets')
        .set('Cookie', token)
        .send({
            title: 'title',
            price: 20
        })
        .expect(201)
    await request(app)
        .put(`/api/tickets/${res.body.id}`)
        .set('Cookie', token)
        .send({
            title: '',
            price: 20
        })
        .expect(400)
    await request(app)
        .put(`/api/tickets/${res.body.id}`)
        .set('Cookie', token)
        .send({
            title: 'new title',
            price: -10
        })
        .expect(400)
})

it('return a 200 if successfully Updated', async () => {
    const token = global.signup()
    const res = await request(app)
        .post('/api/tickets')
        .set('Cookie', token)
        .send({
            title: 'title',
            price: 20
        })
        .expect(201)
    const newTitle = 'new title'
    const newPrice = 200
    await request(app)
        .put(`/api/tickets/${res.body.id}`)
        .set('Cookie', token)
        .send({
            title: newTitle,
            price: newPrice
        })
        .expect(200)
    const ticket = await request(app)
        .get(`/api/tickets/${res.body.id}`)
        .send()
        .expect(200)
    expect(ticket.body.title).toEqual(newTitle)
    expect(ticket.body.price).toEqual(newPrice)
})

it('Publish an event', async()=>{
    const token = global.signup()
    const res = await request(app)
        .post('/api/tickets')
        .set('Cookie', token)
        .send({
            title: 'title',
            price: 20
        })
        .expect(201)
    const newTitle = 'new title'
    const newPrice = 200
    await request(app)
        .put(`/api/tickets/${res.body.id}`)
        .set('Cookie', token)
        .send({
            title: newTitle,
            price: newPrice
        })
        .expect(200)
    const ticket = await request(app)
        .get(`/api/tickets/${res.body.id}`)
        .send()
        .expect(200)
    expect(ticket.body.title).toEqual(newTitle)
    expect(ticket.body.price).toEqual(newPrice)
    expect(natsWrapper.client.publish).toHaveBeenCalled()
})

it('rejects updating reserved ticket', async()=>{
    const token = global.signup()
    const res = await request(app)
        .post('/api/tickets')
        .set('Cookie', token)
        .send({
            title: 'title',
            price: 20
        })
        .expect(201)
    const newTitle = 'new title'
    const newPrice = 200
    
    const ticket = await Ticket.findById(res.body.id)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    ticket!.set({orderId: new mongoose.Types.ObjectId().toHexString()})
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await ticket!.save()
    await request(app)
        .put(`/api/tickets/${res.body.id}`)
        .set('Cookie', token)
        .send({
            title: newTitle,
            price: newPrice
        })
        .expect(400)
})