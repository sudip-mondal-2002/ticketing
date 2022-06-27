import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';

import { errorHandler, currentUser } from '@tickeing-sm/common';
import { NotFoundError } from '@tickeing-sm/common';

import chargeCreateRouter from './routes/new';
import CustomError from '@tickeing-sm/common/build/errors/custom-error';
import { NotAuthorizedError } from '@tickeing-sm/common';

const app = express();
app.set('trust proxy', true);
app.use(express.json())
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
}))
app.use(currentUser)

app.use(chargeCreateRouter)
app.all('*', () => {
    throw new NotFoundError();
})

app.use(errorHandler)


export default app;