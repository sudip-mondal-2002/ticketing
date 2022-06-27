import { Publisher, Subjects, TicketCreatedEvent } from '@tickeing-sm/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
}


