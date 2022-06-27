import { Router, Request, Response } from "express";
import { body } from 'express-validator';
import { requireAuth, validateRequest, BadRequestError, NotFoundError, OrderStatus, NotAuthorizedError } from '@tickeing-sm/common';

import { stripe } from '../stripe';
import Order from "../models/order";
import Payment from "../models/payment";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = Router();

router.post('/api/payments', requireAuth, [
    body('orderId').not().isEmpty().withMessage('OrderId is required'),
    body('token').not().isEmpty().withMessage('Token is required')
],
    validateRequest,
    async (req: Request, res: Response) => {
        const { orderId, token } = req.body;
        const order = await Order.findById(orderId);
        if (!order) {
            throw new NotFoundError();
        }
        if (order.userId !== req.currentUser?.id) {
            throw new NotAuthorizedError()
        }
        if (order.status === OrderStatus.Cancelled) {
            throw new BadRequestError('Invalid order');
        }
        const stripeCharge = await stripe.charges.create({
            amount: order.price * 100,
            currency: 'usd',
            source: token
        })
        const payment = Payment.build({
            orderId: order.id,
            stripeId: stripeCharge.id
        })

        await payment.save();
        await new PaymentCreatedPublisher(natsWrapper.client).publish({
            id: payment.id,
            orderId: payment.orderId,
            stripeId: payment.stripeId
        })

        res.status(201).json(payment);
    })

export default router;