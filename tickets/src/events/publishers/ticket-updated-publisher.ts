import { Publisher, Subjects, TicketUpdatedEvent } from '@tickeing-sm/common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}


