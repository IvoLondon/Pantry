import express from 'express';
import { json, urlencoded } from 'body-parser'; //TODO: CHECK
import morgan from 'morgan';
import cors from 'cors';

import configs from './config/index';
import { connect } from './utils/db';

import itemRouter from './resources/item/item.router'

export const app = express();

app.disable('x-powered-by');

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/api', itemRouter);

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