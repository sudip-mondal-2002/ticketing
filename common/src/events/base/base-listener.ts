/* eslint-disable @typescript-eslint/no-explicit-any */
import { Message, Stan } from 'node-nats-streaming';
import { Subjects } from '../types/subjects';
interface Event {
    subject: Subjects;
    data: any;
}
export abstract class Listener<T extends Event> {
    abstract subject: T['subject'];
    abstract onMessage(data: T['data'], msg: Message): void;
    abstract queueGroupName: string;

    protected client: Stan;
    protected ackwait = 5 * 1000;

    constructor(client: Stan) {
        this.client = client;
    }

    subscriptionOptions() {
        return this.client.subscriptionOptions()
            .setDeliverAllAvailable()
            .setManualAckMode(true)
            .setAckWait(this.ackwait)
            .setDurableName(this.queueGroupName);
    }
    listen() {
        const subscription = this.client.subscribe(this.subject, this.queueGroupName, this.subscriptionOptions());
        subscription.on('message', (msg: any) => {
            console.log(`Message received: ${this.subject} / ${this.queueGroupName}`);
            const parsedData = this.parseMessage(msg);
            this.onMessage(parsedData, msg);
        })
    }

    parseMessage(msg: Message): any {
        const data = msg.getData();
        return typeof data === 'string' ?
            JSON.parse(data) :
            JSON.parse(data.toString('utf8'));
    }
}
