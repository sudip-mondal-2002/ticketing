import app from './app';
import mongoose from 'mongoose';

const startDB = async () => {
    if(!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined');
    }
    if(!process.env.MONGO_URI) {
        throw new Error('MONGO_URI must be defined');
    }
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('DB connected');
    } catch (err) {
        console.error(err);
    }
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    })
}

startDB()