import { Subjects, Publisher, PaymentCreatedEvent } from "@tickeing-sm/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated;
}