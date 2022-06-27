import { Subjects, Publisher, OrderCancelledEvent } from "@tickeing-sm/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
}