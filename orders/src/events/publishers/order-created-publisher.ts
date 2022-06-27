import {Publisher, OrderCreatedEvent, Subjects} from '@tickeing-sm/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
}