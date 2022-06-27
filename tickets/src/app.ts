import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';

import { errorHandler, currentUser } from '@tickeing-sm/common';
import { NotFoundError } from '@tickeing-sm/common';

import createTicketRouter from './routes/new';
import showTicketRouter from './routes/show';
import indexTicketRouter from './routes/index';
import updateTicketRouter from './routes/update';

const app = express();
app.set('trust proxy', true);
app.use(express.json())
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
}))
app.use(currentUser)

app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);

app.all('*', () => {
    throw new NotFoundError();
})

app.use(errorHandler)

export default app;