import { Subjects, OrderCreatedEvent, Listener } from '@tickeing-sm/common';
import { Message } from 'node-nats-streaming';
import expirationQueue from '../../queues/expiration-queue';
import { ExpirationCompletePublisher } from '../publishers/expiration-completed-publisher';
export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
    queueGroupName = 'expiration-service';
    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {

        const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
        if (delay <= 0) {
            new ExpirationCompletePublisher(this.client).publish({
                orderId: data.id
            });
            msg.ack();
            return;
        }
        // process the message
        await expirationQueue.add({
            orderId: data.id
        }, {
            delay
        })

        msg.ack();
    }
}