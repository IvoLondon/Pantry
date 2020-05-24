import express from 'express';
import { json, urlencoded } from 'body-parser'; //TODO: CHECK
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from 'cors';

import configs from './config/index';
import { connect } from './utils/db';

import userRouter from './resources/user/user.router';
import storeRouter from './resources/store/store.router';

export const app = express();

app.disable('x-powered-by');

app.use(cookieParser());
app.use(cors({ credentials: true, origin: `${configs.clientHostUrl}` }));
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/auth', userRouter);
app.use('/api', itemRouter);

app.get('/', (req, res) => res.status(200).send('Works'));


export const start = async () => {
    try {
        await connect();
        app.listen(configs.port, () => {
            console.log(`Server is listening to port ${configs.port}`)
        })
    } catch (e) {
        console.log(e);
    }
}