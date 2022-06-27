import request from 'supertest';
import app from '../../app';

const createTicket = async () => {
    const title = 'concert';
    const price = 20;

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signup())
        .send({
            title, price
        })
        .expect(201);
    return response.body.id;
}

it('can fetch a list of tickets', async () => {
    const n = 3
    await Promise.all(Array(n).fill(null).map(() => createTicket()));
    const response = await request(app)
        .get('/api/tickets')
        .send()
        .expect(200)
    expect(response.body.length).toEqual(n)
})


