import request from 'supertest';
import app from '../../app';

it('returns a 404 if ticket not found', async () => {
    const id = global.fakeTicketId()
    await request(app)
        .get(`/api/tickets/${id}`)
        .send()
        .expect(404);
})


it('returns a 200 if ticket is found', async () => {
    const title = 'concert';
    const price = 20;

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signup())
        .send({
            title, price
        })
        .expect(201);
    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send()
        .expect(200);

    expect(ticketResponse.body.title).toEqual(title);
    expect(ticketResponse.body.price).toEqual(price);

})