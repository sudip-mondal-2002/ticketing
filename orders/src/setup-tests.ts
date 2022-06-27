import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import JWT from 'jsonwebtoken';
let mongo: MongoMemoryServer;
jest.setTimeout(50000);
jest.mock('./nats-wrapper');
beforeAll(async () => {
    process.env.JWT_KEY = 'asdf';
    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();
    await mongoose.connect(mongoUri)
})

beforeEach(async () => {
    jest.clearAllMocks()
    const collections = await mongoose.connection.db.collections();
    for (const collection of collections) {
        await collection.deleteMany({});
    }
})

afterAll(async () => {
    await mongoose.connection.close();
    await mongo.stop();
})

declare global {
    function signup(): string[];
    function fakeTicketId(): string;
}

global.signup = () => {
    const payload = {
        email: 'test@test.com',
        id: new mongoose.Types.ObjectId().toHexString()
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const token = JWT.sign(payload, process.env.JWT_KEY!)
    const session = { jwt: token }
    const sessionJSON = JSON.stringify(session)
    const base64 = Buffer.from(sessionJSON).toString('base64')
    return [`session=${base64}`]
}

global.fakeTicketId = () => {
    return new mongoose.Types.ObjectId().toHexString();
}
