import { Listener, OrderCreatedEvent, Subjects } from "@tickeing-sm/common";
import { Message } from "node-nats-streaming";
import Order from "../../models/order";
export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
    queueGroupName = 'payments-service';
    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        const { id, version, ticket: { price }, userId, status } = data;
        const order = Order.build({
            id,
            version,
            price,
            userId,
            status
        });
        await order.save();

        msg.ack();
    }
}