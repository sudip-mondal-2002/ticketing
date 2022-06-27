import {Subjects, ExpirationCompleteEvent, Publisher} from "@tickeing-sm/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete;
}