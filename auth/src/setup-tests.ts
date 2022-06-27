import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import app from './../app';
import request from 'supertest';


let mongo: MongoMemoryServer;
beforeAll(async () => {
    process.env.JWT_KEY = 'asdf';
    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();
    await mongoose.connect(mongoUri)
})

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();
    for (const collection of collections) {
        await collection.deleteMany({});
    }
})

afterAll(async () => {
    await mongoose.connection.close();
    await mongo.stop();
})

declare global{
    function signup(): Promise<string[]>;
}

global.signup = async () => {
    const email = 'test@test.com'
    const password = 'password'
    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email,
            password
        })
    const cookie = response.get('Set-Cookie');
    return cookie;
}

