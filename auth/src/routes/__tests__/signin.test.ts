import request from 'supertest';
import app from '../../app';

it('should return a cookie with status 200 on succesful signin', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201)

    const response = await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(200)
    expect(response.get('Set-Cookie')).toBeDefined()
})
it('fails when email not registered', async () => {
    await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(400)
})
it('fails when password is incorrect', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201)
    await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: 'wrong'
        })
        .expect(400)
})
it('should return a 400 with an invalid email', async () => {
    await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test',
            password: 'password'
        })
        .expect(400)
})

it('should return a 400 with an invalid password', async () => {
    await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: ' a'
        })
        .expect(400)
})

it('should return a 400 with missing email and password', async () => {
    await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com'
        })
        .expect(400)
    await request(app)
        .post('/api/users/signin')
        .send({
            password: 'password'
        })
        .expect(400)
})