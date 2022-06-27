import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';

import currentuserRoute from './routes/currentuser';
import signinRoute from './routes/signin';
import signoutRoute from './routes/signout';
import signupRoute from './routes/signup';

import {errorHandler} from '@tickeing-sm/common';
import { NotFoundError } from '@tickeing-sm/common';

const app = express();
app.set('trust proxy', true);
app.use(express.json())
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
}))

app.use(currentuserRoute)
app.use(signinRoute)
app.use(signoutRoute)
app.use(signupRoute)

app.all('*', () => {
    throw new NotFoundError();
})
app.use(errorHandler)

export default app;