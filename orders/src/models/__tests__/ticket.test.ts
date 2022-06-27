/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Ticket from '../ticket';

it('implements optimistic concurrency control', async () => {
    const ticket = Ticket.build({
        price: 20
    })
    await ticket.save();
    const firstInstance = await Ticket.findById(ticket.id).exec();
    const secondInstance = await Ticket.findById(ticket.id).exec();
    firstInstance!.set({ price: 100 });
    await firstInstance!.save();
    try {
        await secondInstance!.save();
    }catch (err) {
        return;
    }
    throw new Error('Should not reach this point');
})

it('increments the version number on multiple saves', async () => {
    const ticket = Ticket.build({
        price: 20
    })
    await ticket.save();
    expect(ticket.version).toEqual(0);
    await ticket.save();
    expect(ticket.version).toEqual(1);
    await ticket.save();
    expect(ticket.version).toEqual(2);
})