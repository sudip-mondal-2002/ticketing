import express from 'express'
import 'express-async-errors';
import cookieSession from 'cookie-session';

import { NotFoundError, currentUser, errorHandler } from '@tickeing-sm/common'

import indexTicketRoute from './routes/index'
import showTicketRoute from './routes/show'
import newTicketRoute from './routes/new'
import deleteTicketRoute from './routes/delete'


const app = express();
app.set('trust proxy', true);
app.use(express.json())
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
}))
app.use(currentUser)

app.use(indexTicketRoute)
app.use(showTicketRoute)
app.use(newTicketRoute)
app.use(deleteTicketRoute)

app.all('*', () => {
    throw new NotFoundError();
})

app.use(errorHandler)

export default app;