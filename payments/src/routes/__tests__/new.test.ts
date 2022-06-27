import request from 'supertest'
import app from '../../app'
import mongoose from 'mongoose';
import { OrderStatus } from '@tickeing-sm/common';
import Order from '../../models/order';
import {stripe} from '../../stripe';
it('returns a 404 when purchasing a non-existent item', async () => {
    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signup())
        .send({
            token: '123123',
            orderId: new mongoose.Types.ObjectId().toHexString()
        })
        .expect(404)
})
it('return a 401 when purchasing an order doesnt belong to user', async () => {
    const order = new Order({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        version: 0,
        price: 10
    })
    await order.save()
    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signup())
        .send({
            token: '123123',
            orderId: order.id
        })
        .expect(401)
})
it('returns a 400 when purchasing an cancelled order', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString()
    const order = new Order({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId,
        status: OrderStatus.Cancelled,
        version: 0,
        price: 10
    })
    await order.save()
    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signup(userId))
        .send({
            token: '123123',
            orderId: order.id
        })
        .expect(400)
})

it('returns a 201 with valid inputs', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString()
    const order = new Order({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId,
        status: OrderStatus.Created,
        version: 0,
        price: 10
    })
    await order.save()
    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signup(userId))
        .send({
            token: 'tok_visa',
            orderId: order.id
        })
        .expect(201)
    expect(stripe.charges.create).toHaveBeenCalled()

    const stripeCharge = (stripe.charges.create as jest.Mock).mock.calls[0][0]
    expect(stripeCharge.source).toEqual('tok_visa')
    expect(stripeCharge.amount).toEqual(order.price * 100)
    expect(stripeCharge.currency).toEqual('usd')
})