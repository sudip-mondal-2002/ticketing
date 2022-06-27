import { OrderStatus } from "@tickeing-sm/common";
import mongoose from "mongoose";
import Order from "./order";
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
interface TicketAttrs {
    price: number;
}
export interface TicketDoc extends mongoose.Document {
    price: number;
    version: number;
    isReserved(): Promise<boolean>
}
interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc;
    findByEvent(event: { id: mongoose.Types.ObjectId | string, version:number }): Promise<TicketDoc | null>;
}
const ticketSchema = new mongoose.Schema({
    price: {
        type: Number,
        required: true
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket(attrs);
}

ticketSchema.statics.findByEvent = (event: { id: mongoose.Types.ObjectId | string, version:number }) => {
    return Ticket.findOne({
        _id : event.id,
        version: event.version - 1
    }).exec()
}

ticketSchema.methods.isReserved = async function(){
    const existingOrder = await Order.findOne({
        ticket: this,
        status: {
            $in : [
                OrderStatus.Created,
                OrderStatus.AwaitingPayment,
                OrderStatus.Complete
            ]
        }
    }).exec()
    
    return !!existingOrder

}

ticketSchema.set('versionKey', 'version');

ticketSchema.plugin(updateIfCurrentPlugin);

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export default Ticket;
