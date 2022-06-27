import { OrderCancelledEvent, Subjects, Listener, NotFoundError, OrderStatus } from "@tickeing-sm/common";
import { Message } from "node-nats-streaming";
import Order from "../../models/order";
export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
    queueGroupName = "payments-service";
    async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
        const { id, version } = data;
        const order = await Order.findByEvent({
            id,
            version
        })
        if (!order) {
            throw new NotFoundError();
        }
        order.set({ status: OrderStatus.Cancelled });
        await order.save();
        msg.ack();
    }
}