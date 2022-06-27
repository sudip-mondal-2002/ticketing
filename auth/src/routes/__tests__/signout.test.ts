import request from 'supertest'
import app from '../../app';

it('should clear the cookie after sign out', async () => {
    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201)
    expect(response.get('Set-Cookie')).toBeDefined()
    const response2 = await request(app)
        .post('/api/users/signout')
        .send()
        .expect(200)
    expect(response2.get('Set-Cookie').shift()).toMatch(/1970/)
})
